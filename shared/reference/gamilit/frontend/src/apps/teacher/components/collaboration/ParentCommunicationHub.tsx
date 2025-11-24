import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { MessageSquare, Send, FileText, Users } from 'lucide-react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { InputDetective } from '@shared/components/base/InputDetective';

interface ParentCommunicationHubProps {
  classroomId: string;
  students: Array<{ id: string; full_name: string }>;
}

export function ParentCommunicationHub({ classroomId, students }: ParentCommunicationHubProps) {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [template, setTemplate] = useState('');
  const [sending, setSending] = useState(false);

  const templates = [
    { id: 'progress', name: 'Actualización de Progreso', content: 'Estimado padre/madre,\n\nMe complace informarle sobre el progreso de {student_name} en nuestra clase...' },
    { id: 'achievement', name: 'Logro Destacado', content: 'Estimado padre/madre,\n\n¡Felicitaciones! {student_name} ha alcanzado un logro importante...' },
    { id: 'concern', name: 'Área de Mejora', content: 'Estimado padre/madre,\n\nMe gustaría conversar sobre algunas áreas donde {student_name} podría mejorar...' },
  ];

  const handleSend = async () => {
    if (!subject || !body || selectedStudents.length === 0) {
      toast.error('Complete todos los campos requeridos', {
        duration: 3000,
        icon: '✉️',
      });
      return;
    }

    try {
      setSending(true);
      await fetch('/api/classroom/communications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classroom_id: classroomId,
          recipient_type: 'parent',
          recipient_ids: selectedStudents,
          subject,
          body,
        }),
      });
      toast.success(`Mensajes enviados exitosamente a ${selectedStudents.length} padres`, {
        duration: 4000,
        icon: '✅',
      });
      setSubject('');
      setBody('');
      setSelectedStudents([]);
    } catch (error) {
      toast.error('Error al enviar mensajes. Por favor, intenta de nuevo.', {
        duration: 4000,
      });
    } finally {
      setSending(false);
    }
  };

  const loadTemplate = (templateId: string) => {
    const t = templates.find(t => t.id === templateId);
    if (t) {
      setSubject(t.name);
      setBody(t.content);
      setTemplate(templateId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <MessageSquare className="w-8 h-8 text-detective-orange" />
        <div>
          <h2 className="text-2xl font-bold text-detective-text">Comunicación con Padres</h2>
          <p className="text-detective-text-secondary">Envía actualizaciones a padres de familia</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Templates */}
        <DetectiveCard>
          <h3 className="text-lg font-bold text-detective-text mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Plantillas
          </h3>
          <div className="space-y-2">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => loadTemplate(t.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  template === t.id
                    ? 'bg-detective-orange text-white'
                    : 'bg-detective-bg-secondary text-detective-text hover:bg-opacity-80'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </DetectiveCard>

        {/* Message Form */}
        <div className="lg:col-span-2 space-y-4">
          <DetectiveCard>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-detective-text mb-2">Asunto</label>
                <InputDetective
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Asunto del mensaje"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-detective-text mb-2">Mensaje</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={10}
                  className="w-full bg-detective-bg-secondary border border-detective-border rounded-lg px-4 py-2 text-detective-text focus:outline-none focus:border-detective-orange"
                  placeholder="Escribe tu mensaje aquí..."
                />
                <p className="text-xs text-detective-text-secondary mt-2">
                  Usa {'{student_name}'} para incluir el nombre del estudiante automáticamente
                </p>
              </div>
            </div>
          </DetectiveCard>

          <DetectiveCard>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-detective-text flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Destinatarios
                </h3>
                <span className="text-sm text-detective-text-secondary">
                  {selectedStudents.length} seleccionados
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {students.map((student) => (
                  <label
                    key={student.id}
                    className="flex items-center gap-2 p-2 bg-detective-bg-secondary rounded cursor-pointer hover:bg-opacity-80"
                  >
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStudents([...selectedStudents, student.id]);
                        } else {
                          setSelectedStudents(selectedStudents.filter(id => id !== student.id));
                        }
                      }}
                      className="rounded border-detective-orange text-detective-orange focus:ring-detective-orange"
                    />
                    <span className="text-sm text-detective-text">{student.full_name}</span>
                  </label>
                ))}
              </div>
            </div>
          </DetectiveCard>

          <div className="flex justify-end">
            <DetectiveButton onClick={handleSend} disabled={sending}>
              <Send className="w-5 h-5" />
              {sending ? 'Enviando...' : 'Enviar Mensajes'}
            </DetectiveButton>
          </div>
        </div>
      </div>
    </div>
  );
}
