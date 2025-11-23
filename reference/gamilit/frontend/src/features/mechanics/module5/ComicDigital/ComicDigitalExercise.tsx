import React, { useState } from 'react';
import { Plus, Image, Type, MessageSquare, Download } from 'lucide-react';

interface ComicPanel {
  id: string;
  layout: 'full' | 'half' | 'third';
  image?: string;
  text: string;
  speechBubbles: SpeechBubble[];
}

interface SpeechBubble {
  id: string;
  text: string;
  x: number;
  y: number;
  type: 'speech' | 'thought' | 'caption';
}

export const ComicDigitalExercise: React.FC = () => {
  const [panels, setPanels] = useState<ComicPanel[]>([]);
  const [selectedPanel, setSelectedPanel] = useState<string | null>(null);
  const [title, setTitle] = useState('La Historia de Marie Curie');

  const layouts = [
    { id: 'full', name: 'Panel Completo', cols: 1 },
    { id: 'half', name: '2 Paneles', cols: 2 },
    { id: 'third', name: '3 Paneles', cols: 3 },
  ];

  const backgrounds = [
    { id: 'lab', name: 'Laboratorio', color: 'bg-gray-100' },
    { id: 'university', name: 'Universidad', color: 'bg-blue-50' },
    { id: 'award', name: 'Ceremonia', color: 'bg-yellow-50' },
    { id: 'research', name: 'Investigación', color: 'bg-purple-50' },
  ];

  const addPanel = (layout: string) => {
    const newPanel: ComicPanel = {
      id: Date.now().toString(),
      layout: layout as ComicPanel['layout'],
      text: '',
      speechBubbles: [],
    };
    setPanels([...panels, newPanel]);
    setSelectedPanel(newPanel.id);
  };

  const addSpeechBubble = (panelId: string, type: SpeechBubble['type']) => {
    setPanels(panels.map(panel => {
      if (panel.id === panelId) {
        const newBubble: SpeechBubble = {
          id: Date.now().toString(),
          text: 'Escribe aquí...',
          x: 50,
          y: 30,
          type,
        };
        return { ...panel, speechBubbles: [...panel.speechBubbles, newBubble] };
      }
      return panel;
    }));
  };

  const updatePanelText = (panelId: string, text: string) => {
    setPanels(panels.map(panel =>
      panel.id === panelId ? { ...panel, text } : panel
    ));
  };

  return (
    <div className="min-h-screen bg-detective-bg p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-detective shadow-card p-6">
          <h1 className="text-3xl font-bold text-detective-text mb-4">Creador de Cómics Digitales</h1>
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-detective focus:border-detective-orange focus:outline-none"
              placeholder="Título del cómic..."
            />
            <button
              onClick={() => {/* Export logic */}}
              className="flex items-center gap-2 px-4 py-2 bg-detective-orange text-white rounded-detective hover:bg-detective-orange-dark transition-colors font-medium"
            >
              <Download className="w-5 h-5" />
              Exportar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-detective shadow-card p-6 space-y-4">
            <h3 className="font-bold text-detective-text">Herramientas</h3>

            <div>
              <p className="text-detective-text-secondary text-sm mb-2">Agregar Panel:</p>
              <div className="space-y-2">
                {layouts.map(layout => (
                  <button
                    key={layout.id}
                    onClick={() => addPanel(layout.id)}
                    className="w-full py-2 px-4 bg-detective-bg border-2 border-gray-300 rounded-detective hover:border-detective-orange transition-colors text-left"
                  >
                    <Plus className="w-4 h-4 inline mr-2" />
                    {layout.name}
                  </button>
                ))}
              </div>
            </div>

            {selectedPanel && (
              <>
                <div>
                  <p className="text-detective-text-secondary text-sm mb-2">Agregar Globo:</p>
                  <div className="space-y-2">
                    <button
                      onClick={() => addSpeechBubble(selectedPanel, 'speech')}
                      className="w-full py-2 px-4 bg-blue-50 border-2 border-blue-300 rounded-detective hover:bg-blue-100 transition-colors text-left"
                    >
                      <MessageSquare className="w-4 h-4 inline mr-2" />
                      Diálogo
                    </button>
                    <button
                      onClick={() => addSpeechBubble(selectedPanel, 'thought')}
                      className="w-full py-2 px-4 bg-purple-50 border-2 border-purple-300 rounded-detective hover:bg-purple-100 transition-colors text-left"
                    >
                      💭 Pensamiento
                    </button>
                    <button
                      onClick={() => addSpeechBubble(selectedPanel, 'caption')}
                      className="w-full py-2 px-4 bg-yellow-50 border-2 border-yellow-300 rounded-detective hover:bg-yellow-100 transition-colors text-left"
                    >
                      <Type className="w-4 h-4 inline mr-2" />
                      Narración
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-detective-text-secondary text-sm mb-2">Fondos:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {backgrounds.map(bg => (
                      <button
                        key={bg.id}
                        className={`py-2 px-3 ${bg.color} border-2 border-gray-300 rounded hover:border-detective-orange transition-colors text-xs`}
                      >
                        {bg.name}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="lg:col-span-3 bg-white rounded-detective shadow-card p-6">
            <div className="mb-4 text-center">
              <h2 className="text-2xl font-bold text-detective-text">{title}</h2>
            </div>

            <div className="space-y-4 border-4 border-detective-text p-4 rounded-detective bg-white min-h-[600px]">
              {panels.map((panel, index) => (
                <div
                  key={panel.id}
                  onClick={() => setSelectedPanel(panel.id)}
                  className={`border-4 border-detective-text p-4 cursor-pointer relative bg-gray-50 ${
                    selectedPanel === panel.id ? 'ring-4 ring-detective-orange' : ''
                  }`}
                  style={{ minHeight: '200px' }}
                >
                  <div className="absolute top-2 left-2 bg-detective-text text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>

                  {panel.speechBubbles.map(bubble => (
                    <div
                      key={bubble.id}
                      className={`absolute ${
                        bubble.type === 'speech' ? 'bg-white border-2 border-detective-text rounded-xl' :
                        bubble.type === 'thought' ? 'bg-white border-2 border-detective-text rounded-full' :
                        'bg-yellow-100 border-2 border-yellow-400'
                      } px-4 py-2 max-w-xs`}
                      style={{
                        left: `${bubble.x}%`,
                        top: `${bubble.y}%`,
                      }}
                    >
                      <p className="text-sm text-detective-text font-medium">{bubble.text}</p>
                    </div>
                  ))}

                  {selectedPanel === panel.id && (
                    <div className="mt-12">
                      <textarea
                        value={panel.text}
                        onChange={(e) => updatePanelText(panel.id, e.target.value)}
                        placeholder="Descripción de la escena o narración..."
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:border-detective-orange focus:outline-none resize-none"
                        rows={3}
                      />
                    </div>
                  )}
                </div>
              ))}

              {panels.length === 0 && (
                <div className="text-center py-20 text-detective-text-secondary">
                  <Image className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Agrega paneles para comenzar tu cómic</p>
                  <p className="text-sm">sobre la vida de Marie Curie</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
