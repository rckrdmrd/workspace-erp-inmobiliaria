import React, { useState } from 'react';
import { Image, Type, Download, Plus } from 'lucide-react';
import { FileUploader, UploadedFile, ExportButton } from '../../../../shared/components/media';

interface CollageElement {
  id: string;
  type: 'image' | 'text' | 'headline';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export const CollagePrensaExercise: React.FC = () => {
  const [elements, setElements] = useState<CollageElement[]>([]);
  const [uploadedImages, setUploadedImages] = useState<UploadedFile[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  const addHeadline = () => {
    const newElement: CollageElement = {
      id: Date.now().toString(),
      type: 'headline',
      content: 'MARIE CURIE GANA PREMIO NOBEL',
      x: 10,
      y: 10,
      width: 80,
      height: 15,
      rotation: 0,
    };
    setElements([...elements, newElement]);
  };

  const addText = () => {
    const newElement: CollageElement = {
      id: Date.now().toString(),
      type: 'text',
      content: 'La científica descubre el radio...',
      x: 10,
      y: 30,
      width: 40,
      height: 20,
      rotation: 0,
    };
    setElements([...elements, newElement]);
  };

  const addImage = (file: UploadedFile) => {
    const newElement: CollageElement = {
      id: Date.now().toString(),
      type: 'image',
      content: file.url,
      x: 20,
      y: 20,
      width: 30,
      height: 30,
      rotation: 0,
    };
    setElements([...elements, newElement]);
  };

  return (
    <div className="min-h-screen bg-detective-bg p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-detective shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Image className="w-8 h-8 text-detective-orange" />
              <h1 className="text-3xl font-bold text-detective-text">Collage de Prensa</h1>
            </div>
            <ExportButton
              data={{}}
              filename="collage-prensa"
            />
          </div>
          <p className="text-detective-text-secondary">
            Crea un collage estilo periódico sobre Marie Curie y sus logros científicos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-detective shadow-card p-6 space-y-4">
            <h3 className="font-bold text-detective-text">Herramientas</h3>

            <button
              onClick={addHeadline}
              className="w-full flex items-center gap-2 px-4 py-3 bg-detective-orange text-white rounded-detective hover:bg-detective-orange-dark transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              Titular
            </button>

            <button
              onClick={addText}
              className="w-full flex items-center gap-2 px-4 py-3 bg-detective-blue text-white rounded-detective hover:bg-detective-blue/90 transition-colors font-medium"
            >
              <Type className="w-5 h-5" />
              Texto
            </button>

            <div>
              <p className="text-detective-text font-medium mb-2">Agregar Imágenes:</p>
              <FileUploader
                acceptedTypes={['image/*']}
                maxSizeMB={10}
                onUpload={(files: UploadedFile[]) => {
                  setUploadedImages(files);
                  files.forEach((file: UploadedFile) => addImage(file));
                }}
                multiple
              />
            </div>

            <div className="pt-4 border-t">
              <p className="text-detective-text-secondary text-sm">
                💡 Arrastra los elementos en el canvas para organizarlos
              </p>
            </div>
          </div>

          <div className="lg:col-span-3 bg-white rounded-detective shadow-card p-6">
            <div
              className="relative bg-yellow-50 border-4 border-detective-text overflow-hidden"
              style={{ aspectRatio: '3/4', minHeight: '800px' }}
            >
              <div className="absolute top-4 left-4 right-4 text-center border-b-4 border-detective-text pb-2 mb-4">
                <h2 className="font-serif text-4xl font-bold text-detective-text">
                  LE JOURNAL SCIENTIFIQUE
                </h2>
                <p className="text-detective-text-secondary text-sm">Paris, 1903</p>
              </div>

              {elements.map(element => (
                <div
                  key={element.id}
                  onClick={() => setSelectedElement(element.id)}
                  className={`absolute cursor-move ${
                    selectedElement === element.id ? 'ring-4 ring-detective-orange' : ''
                  }`}
                  style={{
                    left: `${element.x}%`,
                    top: `${element.y}%`,
                    width: `${element.width}%`,
                    height: `${element.height}%`,
                    transform: `rotate(${element.rotation}deg)`,
                  }}
                >
                  {element.type === 'headline' && (
                    <div className="bg-detective-text text-white p-3 font-bold text-center text-xl">
                      {element.content}
                    </div>
                  )}
                  {element.type === 'text' && (
                    <div className="bg-white p-3 border-2 border-detective-text text-sm">
                      {element.content}
                    </div>
                  )}
                  {element.type === 'image' && (
                    <img src={element.content} alt="" className="w-full h-full object-cover border-2 border-detective-text" />
                  )}
                </div>
              ))}

              {elements.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-detective-text-secondary">
                    <Image className="w-20 h-20 mx-auto mb-4 opacity-30" />
                    <p className="text-lg">Comienza agregando elementos</p>
                    <p className="text-sm">para crear tu collage de prensa</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
