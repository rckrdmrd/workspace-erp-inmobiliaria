import React, { useState } from 'react';
import { Megaphone, Users, Share2, CheckCircle } from 'lucide-react';

interface Campaign {
  id: string;
  title: string;
  cause: string;
  description: string;
  goal: number;
  signatures: number;
  tags: string[];
}

export const CallToActionExercise: React.FC = () => {
  const [title, setTitle] = useState('');
  const [cause, setCause] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState(100);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  const causes = [
    'Más mujeres en STEM',
    'Becas científicas para mujeres',
    'Reconocimiento a científicas',
    'Educación científica inclusiva',
    'Igualdad en investigación',
  ];

  const availableTags = [
    'Ciencia',
    'Educación',
    'Igualdad',
    'Marie Curie',
    'Mujeres',
    'Investigación',
    'Nobel',
    'Física',
    'Química',
  ];

  const handleCreateCampaign = () => {
    if (!title || !cause || !description) return;

    const newCampaign: Campaign = {
      id: Date.now().toString(),
      title,
      cause,
      description,
      goal,
      signatures: Math.floor(Math.random() * 50),
      tags: selectedTags,
    };

    setCampaigns([newCampaign, ...campaigns]);
    setTitle('');
    setDescription('');
    setSelectedTags([]);
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const signCampaign = (id: string) => {
    setCampaigns(campaigns.map(c =>
      c.id === id ? { ...c, signatures: c.signatures + 1 } : c
    ));
  };

  return (
    <div className="min-h-screen bg-detective-bg p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white rounded-detective shadow-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <Megaphone className="w-8 h-8 text-detective-orange" />
            <h1 className="text-3xl font-bold text-detective-text">Call to Action</h1>
          </div>
          <p className="text-detective-text-secondary">
            Crea una campaña de acción social inspirada en el legado de Marie Curie.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-detective shadow-card p-6 space-y-4">
              <h3 className="font-bold text-detective-text text-xl">Nueva Campaña</h3>

              <div>
                <label className="block text-detective-text font-medium mb-2">Título de la campaña:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Más mujeres en la ciencia"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-detective focus:border-detective-orange focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-detective-text font-medium mb-2">Causa:</label>
                <select
                  value={cause}
                  onChange={(e) => setCause(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-detective focus:border-detective-orange focus:outline-none"
                >
                  <option value="">Selecciona una causa...</option>
                  {causes.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-detective-text font-medium mb-2">Descripción:</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  placeholder="Describe tu campaña, por qué es importante y qué cambio buscas..."
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-detective focus:border-detective-orange focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-detective-text font-medium mb-2">
                  Meta de firmas: {goal}
                </label>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="50"
                  value={goal}
                  onChange={(e) => setGoal(parseInt(e.target.value))}
                  className="w-full accent-detective-orange"
                />
              </div>

              <div>
                <label className="block text-detective-text font-medium mb-2">Etiquetas:</label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedTags.includes(tag)
                          ? 'bg-detective-orange text-white'
                          : 'bg-gray-200 text-detective-text hover:bg-gray-300'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleCreateCampaign}
                disabled={!title || !cause || !description}
                className="w-full py-3 bg-detective-orange text-white rounded-detective hover:bg-detective-orange-dark transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Crear Campaña
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-detective-text text-xl">Campañas Activas</h3>
              {campaigns.map(campaign => (
                <div key={campaign.id} className="bg-white rounded-detective shadow-card p-6">
                  <h4 className="text-xl font-bold text-detective-text mb-2">{campaign.title}</h4>
                  <p className="text-detective-blue font-medium mb-3">{campaign.cause}</p>
                  <p className="text-detective-text-secondary mb-4">{campaign.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {campaign.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-detective-bg text-detective-text text-xs rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-detective-text font-medium">{campaign.signatures} firmas</span>
                      <span className="text-detective-text-secondary">Meta: {campaign.goal}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-detective-orange h-3 rounded-full transition-all"
                        style={{ width: `${Math.min((campaign.signatures / campaign.goal) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => signCampaign(campaign.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-detective-orange text-white rounded-detective hover:bg-detective-orange-dark transition-colors font-medium"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Firmar Petición
                    </button>
                    <button
                      onClick={() => alert('Compartiendo en redes sociales...')}
                      className="flex items-center gap-2 px-4 py-2 bg-detective-blue text-white rounded-detective hover:bg-detective-blue/90 transition-colors font-medium"
                    >
                      <Share2 className="w-5 h-5" />
                      Compartir
                    </button>
                  </div>
                </div>
              ))}

              {campaigns.length === 0 && (
                <div className="text-center py-12 text-detective-text-secondary">
                  <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No hay campañas todavía</p>
                  <p className="text-sm">Crea la primera campaña inspirada en Marie Curie</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-r from-detective-orange to-detective-gold text-white rounded-detective shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Impacto</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-white/80 text-sm">Campañas creadas</p>
                  <p className="text-3xl font-bold">{campaigns.length}</p>
                </div>
                <div>
                  <p className="text-white/80 text-sm">Total de firmas</p>
                  <p className="text-3xl font-bold">
                    {campaigns.reduce((sum, c) => sum + c.signatures, 0)}
                  </p>
                </div>
                <div>
                  <p className="text-white/80 text-sm">Campañas completadas</p>
                  <p className="text-3xl font-bold">
                    {campaigns.filter(c => c.signatures >= c.goal).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-detective-bg-secondary border-2 border-detective-orange/20 rounded-detective p-6">
              <h3 className="font-bold text-detective-text mb-3">💡 Consejos:</h3>
              <ul className="space-y-2 text-detective-text-secondary text-sm">
                <li>• Sé específico en tu propuesta</li>
                <li>• Explica por qué es importante</li>
                <li>• Conecta con el legado de Marie Curie</li>
                <li>• Propón acciones concretas</li>
                <li>• Inspira a otros a actuar</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
