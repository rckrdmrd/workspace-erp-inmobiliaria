import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { Home, Search } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-detective-bg to-detective-bg-secondary flex items-center justify-center p-4">
      <DetectiveCard hoverable={false} className="max-w-lg text-center">
        <div className="text-9xl mb-4">🕵️</div>
        <h1 className="text-6xl font-bold text-detective-orange mb-4">404</h1>
        <h2 className="text-2xl font-bold text-detective-text mb-4">
          Página No Encontrada
        </h2>
        <p className="text-detective-text-secondary mb-8">
          Lo sentimos, la página que buscas no existe o ha sido movida.
          Nuestros mejores detectives no pudieron encontrarla.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <DetectiveButton
            variant="primary"

            icon={<Home className="w-5 h-5" />}
            onClick={() => navigate('/dashboard')}
          >
            Ir al Dashboard
          </DetectiveButton>
          <DetectiveButton
            variant="blue"

            icon={<Search className="w-5 h-5" />}
            onClick={() => navigate(-1)}
          >
            Volver Atrás
          </DetectiveButton>
        </div>
      </DetectiveCard>
    </div>
  );
}
