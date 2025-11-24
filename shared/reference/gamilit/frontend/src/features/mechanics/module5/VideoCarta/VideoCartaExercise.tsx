import React, { useState, useRef } from 'react';
import { Video, Camera, Scissors, Download, Play } from 'lucide-react';
import { VideoPlayer } from '../../../../shared/components/media';

export const VideoCartaExercise: React.FC = () => {
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [filter, setFilter] = useState('none');
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const filters = [
    { id: 'none', name: 'Sin filtro', class: '' },
    { id: 'sepia', name: 'Sepia (Antiguo)', class: 'sepia' },
    { id: 'grayscale', name: 'Blanco y Negro', class: 'grayscale' },
    { id: 'vintage', name: 'Vintage', class: 'contrast-125 brightness-110' },
  ];

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedVideo(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert('Error al acceder a la cámara. Por favor, permite el acceso.');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <div className="min-h-screen bg-detective-bg p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-white rounded-detective shadow-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Video className="w-8 h-8 text-detective-orange" />
            <h1 className="text-3xl font-bold text-detective-text">Video Carta</h1>
          </div>
          <p className="text-detective-text-secondary">
            Graba un video mensaje sobre lo que aprendiste de Marie Curie.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {!recordedVideo ? (
              <div className="bg-white rounded-detective shadow-card p-6">
                <div className="relative bg-black rounded-detective overflow-hidden" style={{ aspectRatio: '16/9' }}>
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className={`w-full h-full ${filter}`}
                  />
                  {!isRecording && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Camera className="w-20 h-20 text-white/50" />
                    </div>
                  )}
                  {isRecording && (
                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full animate-pulse">
                      <div className="w-3 h-3 bg-white rounded-full" />
                      REC
                    </div>
                  )}
                </div>

                <div className="mt-4 flex justify-center gap-4">
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      className="flex items-center gap-2 px-8 py-4 bg-red-600 text-white rounded-detective hover:bg-red-700 transition-colors font-medium text-lg"
                    >
                      <Camera className="w-6 h-6" />
                      Iniciar Grabación
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="flex items-center gap-2 px-8 py-4 bg-detective-text text-white rounded-detective hover:bg-detective-text/90 transition-colors font-medium text-lg"
                    >
                      ⏹ Detener Grabación
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-detective shadow-card p-6 space-y-4">
                <VideoPlayer src={recordedVideo} controls />
                <div className="flex gap-3">
                  <button
                    onClick={() => setRecordedVideo(null)}
                    className="flex-1 px-4 py-3 bg-detective-orange text-white rounded-detective hover:bg-detective-orange-dark transition-colors font-medium"
                  >
                    Grabar Nuevo Video
                  </button>
                  <button
                    onClick={() => {
                      const a = document.createElement('a');
                      a.href = recordedVideo;
                      a.download = 'video-carta-marie-curie.webm';
                      a.click();
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-detective-blue text-white rounded-detective hover:bg-detective-blue/90 transition-colors font-medium"
                  >
                    <Download className="w-5 h-5" />
                    Descargar
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-detective shadow-card p-6">
              <h3 className="font-bold text-detective-text mb-4">Filtros de Video</h3>
              <div className="space-y-2">
                {filters.map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.class)}
                    className={`w-full py-2 px-4 rounded-detective border-2 transition-colors text-left ${
                      filter === f.class
                        ? 'bg-detective-orange text-white border-detective-orange'
                        : 'bg-white border-gray-300 hover:border-detective-orange'
                    }`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-detective-bg-secondary border-2 border-detective-orange/20 rounded-detective p-6">
              <h3 className="font-bold text-detective-text mb-3">💡 Consejos:</h3>
              <ul className="space-y-2 text-detective-text-secondary text-sm">
                <li>• Presenta tu tema al inicio</li>
                <li>• Habla claramente y con entusiasmo</li>
                <li>• Menciona 3 datos sobre Marie Curie</li>
                <li>• Concluye con tu reflexión personal</li>
                <li>• Duración recomendada: 1-3 minutos</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
