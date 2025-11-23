import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ZoomIn, ZoomOut } from 'lucide-react';

interface MagnifyingGlassProps {
  text: string;
  onDiscoverClue?: (clue: string) => void;
}

export const MagnifyingGlass: React.FC<MagnifyingGlassProps> = ({ text, onDiscoverClue }) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (active) {
      const rect = e.currentTarget.getBoundingClientRect();
      setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setActive(!active)}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
            active ? 'bg-detective-orange text-white' : 'bg-white text-detective-text'
          }`}
        >
          <Search className="w-4 h-4" />
          {active ? 'Desactivar Lupa' : 'Activar Lupa'}
        </button>
        {active && (
          <div className="flex items-center gap-2">
            <button onClick={() => setZoom(Math.max(1, zoom - 0.5))} className="p-2 bg-white rounded-lg">
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-detective-sm">{zoom}x</span>
            <button onClick={() => setZoom(Math.min(3, zoom + 0.5))} className="p-2 bg-white rounded-lg">
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      <div
        onMouseMove={handleMouseMove}
        className={`relative p-6 bg-white rounded-lg border-2 ${active ? 'border-detective-orange' : 'border-gray-200'} ${active ? 'cursor-none' : 'cursor-text'}`}
        style={{ lineHeight: '1.8' }}
      >
        <p className="text-detective-base text-detective-text">{text}</p>
        {active && (
          <motion.div
            className="absolute pointer-events-none"
            animate={{ x: position.x - 50, y: position.y - 50 }}
            style={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              border: '3px solid #f97316',
              background: 'rgba(249, 115, 22, 0.1)',
              backdropFilter: 'blur(2px)',
            }}
          />
        )}
      </div>
    </div>
  );
};
