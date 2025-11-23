import React from 'react';
import { CheckCircle, XCircle, AlertCircle, HelpCircle, Shield } from 'lucide-react';
import { Claim, FactCheckResult } from './verificadorFakeNewsTypes';

interface FactCheckDashboardProps {
  claims: Claim[];
  results: FactCheckResult[];
  onVerifyClaim: (claimId: string) => void;
}

export const FactCheckDashboard: React.FC<FactCheckDashboardProps> = ({
  claims,
  results,
  onVerifyClaim,
}) => {
  const getVerdictIcon = (verdict: FactCheckResult['verdict']) => {
    switch (verdict) {
      case 'true':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'false':
        return <XCircle className="w-6 h-6 text-red-600" />;
      case 'partially-true':
        return <AlertCircle className="w-6 h-6 text-yellow-600" />;
      case 'misleading':
        return <AlertCircle className="w-6 h-6 text-orange-600" />;
      case 'unverified':
        return <HelpCircle className="w-6 h-6 text-gray-600" />;
    }
  };

  const getVerdictLabel = (verdict: FactCheckResult['verdict']) => {
    const labels = {
      'true': 'Verdadero',
      'false': 'Falso',
      'partially-true': 'Parcialmente Verdadero',
      'misleading': 'Engañoso',
      'unverified': 'No Verificado',
    };
    return labels[verdict];
  };

  const getVerdictColor = (verdict: FactCheckResult['verdict']) => {
    const colors = {
      'true': 'bg-green-50 border-green-200',
      'false': 'bg-red-50 border-red-200',
      'partially-true': 'bg-yellow-50 border-yellow-200',
      'misleading': 'bg-orange-50 border-orange-200',
      'unverified': 'bg-gray-50 border-gray-200',
    };
    return colors[verdict];
  };

  return (
    <div className="bg-white rounded-detective shadow-card p-6 space-y-4">
      <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
        <Shield className="w-6 h-6 text-detective-orange" />
        <h3 className="text-xl font-bold text-detective-text">Panel de Verificación</h3>
      </div>

      <div className="space-y-3">
        {claims.map((claim, index) => {
          const result = results.find((r) => r.claimId === claim.id);

          return (
            <div
              key={claim.id}
              className={`border-2 rounded-detective p-4 transition-all ${
                result ? getVerdictColor(result.verdict) : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-detective-blue text-white rounded-full font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-detective-text font-medium mb-2">{claim.text}</p>

                  {!result ? (
                    <button
                      onClick={() => onVerifyClaim(claim.id)}
                      className="px-4 py-2 bg-detective-orange text-white rounded-detective hover:bg-detective-orange-dark transition-colors font-medium text-sm"
                    >
                      Verificar Afirmación
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        {getVerdictIcon(result.verdict)}
                        <span className="font-bold text-detective-text">
                          {getVerdictLabel(result.verdict)}
                        </span>
                        <span className="text-detective-text-secondary text-sm">
                          (Confianza: {Math.round(result.confidence * 100)}%)
                        </span>
                      </div>

                      <p className="text-detective-text-secondary text-sm bg-white p-3 rounded border">
                        {result.explanation}
                      </p>

                      <div>
                        <p className="text-detective-text font-medium text-sm mb-2">Fuentes:</p>
                        <div className="space-y-1">
                          {result.sources.map((source, idx) => (
                            <a
                              key={idx}
                              href={source.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-detective-blue hover:underline text-sm"
                            >
                              <Shield className="w-4 h-4" />
                              {source.name} ({source.credibilityScore}/100)
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {claims.length === 0 && (
          <div className="text-center py-8 text-detective-text-secondary">
            <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No hay afirmaciones extraídas todavía.</p>
            <p className="text-sm">Selecciona texto del artículo para empezar.</p>
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {results.filter((r) => r.verdict === 'true').length}
              </p>
              <p className="text-detective-text-secondary text-sm">Verdaderas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {results.filter((r) => r.verdict === 'false').length}
              </p>
              <p className="text-detective-text-secondary text-sm">Falsas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {results.filter((r) => ['partially-true', 'misleading', 'unverified'].includes(r.verdict)).length}
              </p>
              <p className="text-detective-text-secondary text-sm">Dudosas</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
