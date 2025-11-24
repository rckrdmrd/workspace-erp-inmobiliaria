import React from 'react';
import { ChevronRight } from 'lucide-react';
import { HypertextNode } from './navegacionHipertextualTypes';

export const NavigationBreadcrumbs: React.FC<{ visitedNodes: string[]; nodes: HypertextNode[] }> = ({ visitedNodes, nodes }) => (
  <div className="flex items-center gap-2 text-sm">
    {visitedNodes.map((nodeId, idx) => {
      const node = nodes.find(n => n.id === nodeId);
      return (
        <React.Fragment key={nodeId}>
          <span className={idx === visitedNodes.length - 1 ? 'font-bold text-detective-orange' : 'text-gray-600'}>{node?.title || 'Unknown'}</span>
          {idx < visitedNodes.length - 1 && <ChevronRight className="w-4 h-4 text-gray-400" />}
        </React.Fragment>
      );
    })}
  </div>
);
