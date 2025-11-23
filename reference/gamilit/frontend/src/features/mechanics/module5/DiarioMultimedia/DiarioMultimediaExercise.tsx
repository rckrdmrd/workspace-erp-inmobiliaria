import React, { useState } from 'react';
import { BookOpen, Image as ImageIcon, Video, Mic, Save, Eye } from 'lucide-react';
import { FileUploader, UploadedFile } from '../../../../shared/components/media';

interface DiaryEntry {
  id: string;
  date: Date;
  title: string;
  content: string;
  media: UploadedFile[];
  isPrivate: boolean;
}

export const DiarioMultimediaExercise: React.FC = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentContent, setCurrentContent] = useState('');
  const [currentMedia, setCurrentMedia] = useState<UploadedFile[]>([]);
  const [isPrivate, setIsPrivate] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleSaveEntry = () => {
    if (!currentTitle || !currentContent) return;

    const newEntry: DiaryEntry = {
      id: Date.now().toString(),
      date: new Date(),
      title: currentTitle,
      content: currentContent,
      media: currentMedia,
      isPrivate,
    };

    setEntries([newEntry, ...entries]);
    setCurrentTitle('');
    setCurrentContent('');
    setCurrentMedia([]);
    setIsPrivate(false);
  };

  const formatText = (command: string) => {
    const textarea = document.getElementById('diary-content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = currentContent.substring(start, end);

    let newText = currentContent;
    switch (command) {
      case 'bold':
        newText = currentContent.substring(0, start) + `**${selectedText}**` + currentContent.substring(end);
        break;
      case 'italic':
        newText = currentContent.substring(0, start) + `*${selectedText}*` + currentContent.substring(end);
        break;
      case 'heading':
        newText = currentContent.substring(0, start) + `# ${selectedText}` + currentContent.substring(end);
        break;
    }
    setCurrentContent(newText);
  };

  return (
    <div className="min-h-screen bg-detective-bg p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white rounded-detective shadow-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-detective-orange" />
            <h1 className="text-3xl font-bold text-detective-text">Diario Multimedia</h1>
          </div>
          <p className="text-detective-text-secondary">
            Documenta tu aprendizaje sobre Marie Curie con texto, imágenes, videos y audio.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-detective shadow-card p-6 space-y-4">
              <div>
                <label className="block text-detective-text font-medium mb-2">Título de la entrada:</label>
                <input
                  type="text"
                  value={currentTitle}
                  onChange={(e) => setCurrentTitle(e.target.value)}
                  placeholder="Mi investigación sobre la radioactividad..."
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-detective focus:border-detective-orange focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-detective-text font-medium mb-2">Contenido:</label>
                <div className="mb-2 flex gap-2">
                  <button
                    onClick={() => formatText('bold')}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 font-bold"
                    title="Negrita"
                  >
                    B
                  </button>
                  <button
                    onClick={() => formatText('italic')}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 italic"
                    title="Cursiva"
                  >
                    I
                  </button>
                  <button
                    onClick={() => formatText('heading')}
                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 font-bold text-lg"
                    title="Título"
                  >
                    H
                  </button>
                </div>
                <textarea
                  id="diary-content"
                  value={currentContent}
                  onChange={(e) => setCurrentContent(e.target.value)}
                  rows={12}
                  placeholder="Hoy aprendí sobre el descubrimiento del polonio..."
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-detective focus:border-detective-orange focus:outline-none resize-none font-mono"
                />
              </div>

              <div>
                <label className="block text-detective-text font-medium mb-2 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Multimedia:
                </label>
                <FileUploader
                  acceptedTypes={['image/*', 'video/*', 'audio/*']}
                  maxSizeMB={50}
                  onUpload={setCurrentMedia}
                  multiple
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="w-5 h-5 text-detective-orange focus:ring-detective-orange border-gray-300 rounded"
                  />
                  <span className="text-detective-text">Entrada privada</span>
                </label>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSaveEntry}
                  disabled={!currentTitle || !currentContent}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-detective-orange text-white rounded-detective hover:bg-detective-orange-dark transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  Guardar Entrada
                </button>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="px-6 py-3 bg-detective-blue text-white rounded-detective hover:bg-detective-blue/90 transition-colors font-medium flex items-center gap-2"
                >
                  <Eye className="w-5 h-5" />
                  Vista Previa
                </button>
              </div>
            </div>

            {showPreview && (currentTitle || currentContent) && (
              <div className="bg-white rounded-detective shadow-card p-6">
                <h3 className="text-xl font-bold text-detective-text mb-2">Vista Previa</h3>
                <div className="border-t border-gray-200 pt-4">
                  <h2 className="text-2xl font-bold text-detective-text mb-2">{currentTitle}</h2>
                  <p className="text-detective-text-secondary text-sm mb-4">{new Date().toLocaleDateString()}</p>
                  <div className="prose max-w-none text-detective-text whitespace-pre-wrap">
                    {currentContent}
                  </div>
                  {currentMedia.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {currentMedia.map((file) => (
                        <div key={file.id} className="border rounded overflow-hidden">
                          {file.type.startsWith('image/') && (
                            <img src={file.url} alt={file.name} className="w-full h-40 object-cover" />
                          )}
                          {file.type.startsWith('video/') && (
                            <video src={file.url} controls className="w-full" />
                          )}
                          {file.type.startsWith('audio/') && (
                            <audio src={file.url} controls className="w-full" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-detective shadow-card p-6">
              <h3 className="font-bold text-detective-text mb-4">Mis Entradas ({entries.length})</h3>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {entries.map((entry) => (
                  <div key={entry.id} className="border-2 border-gray-200 rounded-detective p-3 hover:border-detective-orange transition-colors">
                    <h4 className="font-medium text-detective-text mb-1">{entry.title}</h4>
                    <p className="text-detective-text-secondary text-xs mb-2">
                      {entry.date.toLocaleDateString()}
                    </p>
                    <p className="text-detective-text-secondary text-sm line-clamp-2">
                      {entry.content}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      {entry.media.length > 0 && (
                        <span className="text-detective-orange text-xs flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" />
                          {entry.media.length}
                        </span>
                      )}
                      {entry.isPrivate && (
                        <span className="text-detective-text-secondary text-xs">🔒 Privada</span>
                      )}
                    </div>
                  </div>
                ))}
                {entries.length === 0 && (
                  <p className="text-center text-detective-text-secondary py-8">
                    No hay entradas todavía. Crea tu primera entrada.
                  </p>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-r from-detective-orange to-detective-gold text-white rounded-detective shadow-lg p-6">
              <h3 className="text-xl font-bold mb-2">Estadísticas</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total de entradas:</span>
                  <span className="font-bold">{entries.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Con multimedia:</span>
                  <span className="font-bold">{entries.filter(e => e.media.length > 0).length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Privadas:</span>
                  <span className="font-bold">{entries.filter(e => e.isPrivate).length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
