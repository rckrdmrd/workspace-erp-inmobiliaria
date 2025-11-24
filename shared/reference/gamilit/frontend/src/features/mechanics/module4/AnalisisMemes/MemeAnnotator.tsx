import React from 'react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { AnnotationMarker } from './AnnotationMarker';
import { MemeAnnotation } from './analisisMemesTypes';

export const MemeAnnotator: React.FC<{ memeUrl: string; annotations: MemeAnnotation[]; onAddAnnotation: (x: number, y: number) => void; isAddingMode: boolean }> = ({ memeUrl, annotations, onAddAnnotation, isAddingMode }) => {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isAddingMode) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      onAddAnnotation(x, y);
    }
  };

  return (
    <DetectiveCard variant="default" padding="lg">
      <div className="relative inline-block" onClick={handleClick} style={{ cursor: isAddingMode ? 'crosshair' : 'default' }}>
        <img src={memeUrl} alt="Meme" className="max-w-full rounded-lg" onError={(e) => { e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="600" height="400" fill="%23ddd"/><text x="300" y="200" text-anchor="middle" fill="%23999" font->Imagen no disponible</text></svg>'; }} />
        {annotations.map(ann => <AnnotationMarker key={ann.id} annotation={ann} />)}
      </div>
    </DetectiveCard>
  );
};
