import React from 'react';
import { FileText, Calendar, BarChart, AlertCircle } from 'lucide-react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import type { ReportType } from '../../types';

interface Template {
  id: string;
  type: ReportType;
  name: string;
  description: string;
  icon: React.ReactNode;
  metrics: string[];
}

interface ReportTemplateSelectorProps {
  selectedTemplate: string | null;
  onSelect: (templateId: string) => void;
}

export function ReportTemplateSelector({ selectedTemplate, onSelect }: ReportTemplateSelectorProps) {
  const templates: Template[] = [
    {
      id: 'monthly_progress',
      type: 'progress',
      name: 'Reporte de Progreso Mensual',
      description: 'Análisis completo del progreso de estudiantes durante el mes',
      icon: <Calendar className="w-6 h-6 text-detective-orange" />,
      metrics: ['Completitud por módulo', 'Score promedio', 'Tiempo invertido', 'Tendencias'],
    },
    {
      id: 'final_evaluation',
      type: 'evaluation',
      name: 'Reporte de Evaluación Final',
      description: 'Evaluación integral del rendimiento de estudiantes',
      icon: <BarChart className="w-6 h-6 text-detective-gold" />,
      metrics: ['Scores finales', 'Logros alcanzados', 'Comparación con objetivos', 'Recomendaciones'],
    },
    {
      id: 'intervention',
      type: 'intervention',
      name: 'Reporte de Intervención',
      description: 'Estudiantes que requieren atención especial',
      icon: <AlertCircle className="w-6 h-6 text-red-500" />,
      metrics: ['Alertas generadas', 'Acciones tomadas', 'Seguimiento', 'Resultados'],
    },
    {
      id: 'custom',
      type: 'custom',
      name: 'Reporte Personalizado',
      description: 'Crea un reporte con métricas específicas',
      icon: <FileText className="w-6 h-6 text-detective-accent" />,
      metrics: ['Selección libre de métricas'],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {templates.map((template) => (
        <DetectiveCard
          key={template.id}
          onClick={() => onSelect(template.id)}
          className={`cursor-pointer transition-all ${
            selectedTemplate === template.id
              ? 'border-detective-orange border-2'
              : 'hover:border-detective-orange'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="p-3 bg-detective-bg-secondary rounded-lg">
                {template.icon}
              </div>
              {selectedTemplate === template.id && (
                <div className="px-2 py-1 bg-detective-orange text-white text-xs font-bold rounded">
                  SELECCIONADO
                </div>
              )}
            </div>
            <div>
              <h3 className="font-bold text-detective-text mb-1">{template.name}</h3>
              <p className="text-sm text-detective-text-secondary">{template.description}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-detective-text mb-2">Incluye:</p>
              <ul className="space-y-1">
                {template.metrics.map((metric, index) => (
                  <li key={index} className="text-xs text-detective-text-secondary flex items-center gap-2">
                    <span className="text-detective-orange">•</span>
                    {metric}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </DetectiveCard>
      ))}
    </div>
  );
}
