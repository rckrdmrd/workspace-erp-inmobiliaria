import { useState } from 'react';
import { User, TrendingUp, AlertCircle, Lightbulb } from 'lucide-react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { useStudentInsights } from '../../hooks/useAnalytics';

interface PerformanceInsightsPanelProps {
  classroomId: string;
  students: Array<{ id: string; full_name: string }>;
}

export function PerformanceInsightsPanel({ students }: PerformanceInsightsPanelProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const { insights } = useStudentInsights(selectedStudentId);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-500 bg-red-500';
      case 'medium': return 'text-yellow-500 bg-yellow-500';
      default: return 'text-green-500 bg-green-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Student Selector */}
      <DetectiveCard>
        <div className="flex items-center gap-4">
          <User className="w-6 h-6 text-detective-orange" />
          <div className="flex-1">
            <label className="block text-sm font-semibold text-detective-text mb-2">
              Seleccionar Estudiante
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full bg-detective-bg-secondary border border-detective-border rounded-lg px-4 py-2 text-detective-text focus:outline-none focus:border-detective-orange"
            >
              <option value="">Seleccionar estudiante...</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.full_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </DetectiveCard>

      {/* Insights Display */}
      {selectedStudentId && insights && (
        <>
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <DetectiveCard hoverable={false}>
              <p className="text-sm text-detective-text-secondary mb-1">Score General</p>
              <p className="text-3xl font-bold text-detective-text">{insights.overall_score.toFixed(0)}%</p>
            </DetectiveCard>
            <DetectiveCard hoverable={false}>
              <p className="text-sm text-detective-text-secondary mb-1">Módulos</p>
              <p className="text-3xl font-bold text-detective-text">
                {insights.modules_completed}/{insights.modules_total}
              </p>
            </DetectiveCard>
            <DetectiveCard hoverable={false}>
              <p className="text-sm text-detective-text-secondary mb-1">Percentil Score</p>
              <p className="text-3xl font-bold text-detective-gold">
                {insights.comparison_to_class.score_percentile.toFixed(0)}%
              </p>
            </DetectiveCard>
            <DetectiveCard hoverable={false}>
              <p className="text-sm text-detective-text-secondary mb-1">Riesgo</p>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getRiskColor(insights.risk_level).split(' ')[1]}`} />
                <p className={`text-2xl font-bold ${getRiskColor(insights.risk_level).split(' ')[0]}`}>
                  {insights.risk_level.toUpperCase()}
                </p>
              </div>
            </DetectiveCard>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DetectiveCard>
              <h3 className="text-lg font-bold text-detective-text mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Fortalezas
              </h3>
              <ul className="space-y-2">
                {insights.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2 text-detective-text">
                    <span className="text-green-500">✓</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </DetectiveCard>

            <DetectiveCard>
              <h3 className="text-lg font-bold text-detective-text mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                Áreas de Mejora
              </h3>
              <ul className="space-y-2">
                {insights.weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start gap-2 text-detective-text">
                    <span className="text-red-500">!</span>
                    <span>{weakness}</span>
                  </li>
                ))}
              </ul>
            </DetectiveCard>
          </div>

          {/* Predictions */}
          <DetectiveCard>
            <h3 className="text-lg font-bold text-detective-text mb-4">Predicciones</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-detective-bg-secondary p-4 rounded-lg">
                <p className="text-sm text-detective-text-secondary mb-2">Probabilidad de Completar</p>
                <p className="text-2xl font-bold text-green-500">
                  {(insights.predictions.completion_probability * 100).toFixed(0)}%
                </p>
              </div>
              <div className="bg-detective-bg-secondary p-4 rounded-lg">
                <p className="text-sm text-detective-text-secondary mb-2">Riesgo de Abandono</p>
                <p className="text-2xl font-bold text-red-500">
                  {(insights.predictions.dropout_risk * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          </DetectiveCard>

          {/* Recommendations */}
          <DetectiveCard>
            <h3 className="text-lg font-bold text-detective-text mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-detective-gold" />
              Recomendaciones
            </h3>
            <ul className="space-y-3">
              {insights.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3 p-3 bg-detective-bg-secondary rounded-lg">
                  <span className="text-detective-gold mt-1">💡</span>
                  <span className="text-detective-text">{rec}</span>
                </li>
              ))}
            </ul>
          </DetectiveCard>
        </>
      )}

      {!selectedStudentId && (
        <DetectiveCard>
          <div className="text-center py-12">
            <User className="w-16 h-16 text-detective-text-secondary mx-auto mb-4" />
            <p className="text-detective-text-secondary">Selecciona un estudiante para ver insights detallados</p>
          </div>
        </DetectiveCard>
      )}
    </div>
  );
}
