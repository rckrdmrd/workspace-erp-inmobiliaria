import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FileText, Download, Calendar, Users } from 'lucide-react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { InputDetective } from '@shared/components/base/InputDetective';
import { ReportTemplateSelector } from './ReportTemplateSelector';
import type { ReportConfig, ReportFormat } from '../../types';

interface ReportGeneratorProps {
  classroomId: string;
  students: Array<{ id: string; full_name: string }>;
}

export function ReportGenerator({ classroomId, students }: ReportGeneratorProps) {
  const [config, setConfig] = useState<Partial<ReportConfig>>({
    format: 'pdf',
    start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
    student_ids: [],
  });
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!selectedTemplate) {
      toast.error('Por favor selecciona una plantilla', {
        duration: 3000,
        icon: '📋',
      });
      return;
    }

    try {
      setGenerating(true);

      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...config,
          classroom_id: classroomId,
          template_id: selectedTemplate,
          type: selectedTemplate.includes('progress') ? 'progress' :
                selectedTemplate.includes('evaluation') ? 'evaluation' :
                selectedTemplate.includes('intervention') ? 'intervention' : 'custom',
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report-${selectedTemplate}-${Date.now()}.${config.format === 'excel' ? 'xlsx' : config.format}`;
        a.click();
        toast.success('Reporte generado exitosamente', {
          duration: 3000,
          icon: '📊',
        });
      } else {
        toast.error('Error al generar el reporte. Por favor, intenta de nuevo.', {
          duration: 4000,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al generar el reporte. Verifica tu conexión.', {
        duration: 4000,
      });
    } finally {
      setGenerating(false);
    }
  };

  const toggleStudent = (studentId: string) => {
    setConfig((prev) => ({
      ...prev,
      student_ids: prev.student_ids?.includes(studentId)
        ? prev.student_ids.filter((id) => id !== studentId)
        : [...(prev.student_ids || []), studentId],
    }));
  };

  const selectAllStudents = () => {
    setConfig((prev) => ({
      ...prev,
      student_ids: students.map((s) => s.id),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <FileText className="w-8 h-8 text-detective-orange" />
        <div>
          <h2 className="text-2xl font-bold text-detective-text">Generador de Reportes</h2>
          <p className="text-detective-text-secondary">Crea reportes personalizados para análisis</p>
        </div>
      </div>

      {/* Template Selection */}
      <div>
        <h3 className="text-lg font-bold text-detective-text mb-4">1. Selecciona una Plantilla</h3>
        <ReportTemplateSelector
          selectedTemplate={selectedTemplate}
          onSelect={setSelectedTemplate}
        />
      </div>

      {/* Configuration */}
      {selectedTemplate && (
        <>
          <div>
            <h3 className="text-lg font-bold text-detective-text mb-4">2. Configura el Reporte</h3>
            <DetectiveCard>
              <div className="space-y-4">
                {/* Date Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-detective-text mb-2">
                      Fecha de Inicio
                    </label>
                    <InputDetective
                      type="date"
                      value={config.start_date}
                      onChange={(e) => setConfig({ ...config, start_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-detective-text mb-2">
                      Fecha de Fin
                    </label>
                    <InputDetective
                      type="date"
                      value={config.end_date}
                      onChange={(e) => setConfig({ ...config, end_date: e.target.value })}
                    />
                  </div>
                </div>

                {/* Format */}
                <div>
                  <label className="block text-sm font-semibold text-detective-text mb-2">
                    Formato de Exportación
                  </label>
                  <div className="flex gap-3">
                    {(['pdf', 'excel', 'csv'] as ReportFormat[]).map((format) => (
                      <label
                        key={format}
                        className="flex items-center gap-2 p-3 bg-detective-bg-secondary rounded-lg cursor-pointer hover:bg-opacity-80 transition-colors"
                      >
                        <input
                          type="radio"
                          name="format"
                          checked={config.format === format}
                          onChange={() => setConfig({ ...config, format })}
                          className="text-detective-orange focus:ring-detective-orange"
                        />
                        <span className="text-detective-text uppercase">{format}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </DetectiveCard>
          </div>

          {/* Student Selection */}
          <div>
            <h3 className="text-lg font-bold text-detective-text mb-4">3. Selecciona Estudiantes</h3>
            <DetectiveCard>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-detective-text-secondary">
                    {config.student_ids?.length || 0} de {students.length} estudiantes seleccionados
                  </p>
                  <DetectiveButton variant="secondary" onClick={selectAllStudents}>
                    Seleccionar Todos
                  </DetectiveButton>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                  {students.map((student) => (
                    <label
                      key={student.id}
                      className="flex items-center gap-2 p-2 bg-detective-bg-secondary rounded cursor-pointer hover:bg-opacity-80 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={config.student_ids?.includes(student.id)}
                        onChange={() => toggleStudent(student.id)}
                        className="rounded border-detective-orange text-detective-orange focus:ring-detective-orange"
                      />
                      <span className="text-sm text-detective-text">{student.full_name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </DetectiveCard>
          </div>

          {/* Generate Button */}
          <div className="flex justify-end">
            <DetectiveButton
              onClick={handleGenerate}
              disabled={generating || !config.student_ids?.length}

            >
              <Download className="w-5 h-5" />
              {generating ? 'Generando...' : 'Generar Reporte'}
            </DetectiveButton>
          </div>
        </>
      )}
    </div>
  );
}
