import React, { useState } from 'react';
import { Share2, Star, Download, MessageCircle, Search } from 'lucide-react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { InputDetective } from '@shared/components/base/InputDetective';
import type { SharedResource } from '../../types';

export function ResourceSharingPanel() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Mock data
  const resources: SharedResource[] = [
    {
      id: 'r1',
      title: 'Estrategia: Gamificación para Historia',
      description: 'Técnicas probadas para aumentar engagement en clases de historia usando mecánicas de juego',
      type: 'strategy',
      category: 'Pedagogía',
      author_id: 't1',
      author_name: 'Prof. Ana García',
      shared_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      rating: 4.8,
      ratings_count: 24,
      downloads: 156,
      comments: [
        { id: 'c1', author_name: 'Prof. Carlos', text: 'Excelente recurso, lo implementé en mi clase', created_at: new Date().toISOString() }
      ],
      tags: ['gamificación', 'historia', 'engagement'],
    },
    {
      id: 'r2',
      title: 'Ejercicio: Línea de Tiempo Interactiva',
      description: 'Plantilla de ejercicio para crear líneas de tiempo interactivas sobre científicos',
      type: 'exercise',
      category: 'Ejercicios',
      author_id: 't2',
      author_name: 'Prof. María López',
      shared_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      rating: 4.5,
      ratings_count: 18,
      downloads: 89,
      comments: [],
      tags: ['linea-tiempo', 'interactivo', 'ciencia'],
    },
  ];

  const categories = ['all', 'Pedagogía', 'Ejercicios', 'Evaluaciones', 'Multimedia'];

  const filteredResources = resources.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         r.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || r.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Share2 className="w-8 h-8 text-detective-orange" />
        <div>
          <h2 className="text-2xl font-bold text-detective-text">Recursos Compartidos</h2>
          <p className="text-detective-text-secondary">Comparte y descubre recursos con otros profesores</p>
        </div>
      </div>

      {/* Search and Filter */}
      <DetectiveCard>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-detective-text-secondary" />
            <InputDetective
              type="text"
              placeholder="Buscar recursos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <DetectiveButton
                key={cat}
                variant={categoryFilter === cat ? 'primary' : 'secondary'}

                onClick={() => setCategoryFilter(cat)}
              >
                {cat === 'all' ? 'Todos' : cat}
              </DetectiveButton>
            ))}
          </div>
        </div>
      </DetectiveCard>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredResources.map((resource) => (
          <DetectiveCard key={resource.id} hoverable={false}>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-detective-text mb-1">{resource.title}</h3>
                  <p className="text-sm text-detective-text-secondary mb-2">{resource.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-detective-bg-secondary text-xs font-semibold text-detective-text rounded">
                      {resource.category}
                    </span>
                    <span className="text-xs text-detective-text-secondary">
                      por {resource.author_name}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-detective-text-secondary">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-detective-gold fill-detective-gold" />
                  <span>{resource.rating.toFixed(1)}</span>
                  <span>({resource.ratings_count})</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  <span>{resource.downloads}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{resource.comments.length}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {resource.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-detective-bg text-xs text-detective-text-secondary rounded">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex gap-2 pt-3 border-t border-detective-border">
                <DetectiveButton variant="secondary">
                  <Download className="w-4 h-4" />
                  Descargar
                </DetectiveButton>
                <DetectiveButton variant="secondary">
                  <MessageCircle className="w-4 h-4" />
                  Comentar
                </DetectiveButton>
              </div>
            </div>
          </DetectiveCard>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <DetectiveCard>
          <div className="text-center py-12">
            <Share2 className="w-16 h-16 text-detective-text-secondary mx-auto mb-4" />
            <p className="text-detective-text-secondary">No se encontraron recursos</p>
          </div>
        </DetectiveCard>
      )}
    </div>
  );
}
