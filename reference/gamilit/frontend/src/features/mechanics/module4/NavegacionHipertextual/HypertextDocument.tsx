import React from 'react';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { HypertextNode } from './navegacionHipertextualTypes';
import { ExternalLink } from 'lucide-react';

export const HypertextDocument: React.FC<{ node: HypertextNode; onLinkClick: (id: string) => void }> = ({ node, onLinkClick }) => (
  <div>
    <h2 className="text-2xl font-bold text-detective-text mb-4">{node.title}</h2>
    <p className="text-detective-body mb-6 whitespace-pre-line">{node.content}</p>
    {node.links.length > 0 && (
      <div className="space-y-3">
        <h3 className="font-semibold text-detective-text">Enlaces:</h3>
        {node.links.map(link => (
          <DetectiveButton key={link.targetId} variant="blue" onClick={() => onLinkClick(link.targetId)} icon={<ExternalLink />} className="mr-2">
            {link.label}
          </DetectiveButton>
        ))}
      </div>
    )}
  </div>
);
