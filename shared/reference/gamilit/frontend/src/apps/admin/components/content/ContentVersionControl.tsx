import React, { useState } from 'react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { GitBranch, History, RotateCcw, User, Calendar } from 'lucide-react';

interface Version {
  id: string;
  version: string;
  timestamp: string;
  author: string;
  changes: string;
  changesSummary: { added: number; modified: number; deleted: number };
  content: any;
}

export const ContentVersionControl: React.FC = () => {
  // Mock data - replace with actual API calls
  const [versions] = useState<Version[]>([
    {
      id: '1',
      version: 'v3.2.1',
      timestamp: '2024-10-16T10:30:00Z',
      author: 'admin@glit.com',
      changes: 'Updated exercise instructions\nFixed typo in question 3\nImproved hints',
      changesSummary: { added: 2, modified: 5, deleted: 1 },
      content: {},
    },
    {
      id: '2',
      version: 'v3.2.0',
      timestamp: '2024-10-15T14:20:00Z',
      author: 'teacher@glit.com',
      changes: 'Added new questions\nReorganized content structure',
      changesSummary: { added: 8, modified: 3, deleted: 0 },
      content: {},
    },
    {
      id: '3',
      version: 'v3.1.0',
      timestamp: '2024-10-14T09:15:00Z',
      author: 'admin@glit.com',
      changes: 'Initial version after migration',
      changesSummary: { added: 15, modified: 0, deleted: 0 },
      content: {},
    },
  ]);

  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [compareVersion, setCompareVersion] = useState<string | null>(null);

  const handleRestore = async (versionId: string) => {
    if (!confirm('Restore to this version? Current changes will be saved as a new version.')) return;

    try {
      // API call to restore version
      console.log('Restoring version:', versionId);
      alert('Version restored successfully!');
    } catch (error) {
      console.error('Restore failed:', error);
      alert('Restore failed');
    }
  };

  const selectedVersionData = versions.find((v) => v.id === selectedVersion);
  const compareVersionData = versions.find((v) => v.id === compareVersion);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GitBranch className="w-8 h-8 text-detective-orange" />
          <div>
            <h2 className="text-detective-subtitle">Content Version Control</h2>
            <p className="text-detective-small text-gray-400">Track and restore content changes</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Version History */}
        <div className="lg:col-span-1">
          <DetectiveCard>
            <div className="flex items-center gap-2 mb-4">
              <History className="w-5 h-5 text-detective-orange" />
              <h3 className="text-detective-subtitle">Version History</h3>
            </div>

            <div className="space-y-2">
              {versions.map((version, index) => (
                <div
                  key={version.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedVersion === version.id
                      ? 'bg-detective-orange/20 border border-detective-orange'
                      : 'bg-detective-bg-secondary hover:bg-detective-bg-secondary/70'
                  }`}
                  onClick={() => setSelectedVersion(version.id)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-detective-base font-bold">{version.version}</span>
                    {index === 0 && (
                      <span className="px-2 py-0.5 bg-green-500/20 text-green-500 rounded text-xs">CURRENT</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-detective-small text-gray-400 mb-2">
                    <User className="w-3 h-3" />
                    <span>{version.author}</span>
                  </div>

                  <div className="flex items-center gap-2 text-detective-small text-gray-400">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(version.timestamp).toLocaleString('es-ES')}</span>
                  </div>

                  <div className="flex items-center gap-3 mt-2 text-xs">
                    <span className="text-green-500">+{version.changesSummary.added}</span>
                    <span className="text-yellow-500">~{version.changesSummary.modified}</span>
                    <span className="text-red-500">-{version.changesSummary.deleted}</span>
                  </div>
                </div>
              ))}
            </div>
          </DetectiveCard>
        </div>

        {/* Version Details */}
        <div className="lg:col-span-2">
          {selectedVersionData ? (
            <div className="space-y-4">
              <DetectiveCard>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-detective-subtitle">{selectedVersionData.version}</h3>
                    <p className="text-detective-small text-gray-400">
                      by {selectedVersionData.author} on{' '}
                      {new Date(selectedVersionData.timestamp).toLocaleString('es-ES')}
                    </p>
                  </div>
                  <DetectiveButton
                    variant="blue"

                    icon={<RotateCcw className="w-4 h-4" />}
                    onClick={() => handleRestore(selectedVersionData.id)}
                    disabled={versions[0].id === selectedVersionData.id}
                  >
                    Restore
                  </DetectiveButton>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="text-detective-small text-gray-400">Added</p>
                    <p className="text-2xl font-bold text-green-500">+{selectedVersionData.changesSummary.added}</p>
                  </div>
                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <p className="text-detective-small text-gray-400">Modified</p>
                    <p className="text-2xl font-bold text-yellow-500">
                      ~{selectedVersionData.changesSummary.modified}
                    </p>
                  </div>
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-detective-small text-gray-400">Deleted</p>
                    <p className="text-2xl font-bold text-red-500">-{selectedVersionData.changesSummary.deleted}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-detective-base font-semibold mb-2">Changes:</h4>
                  <div className="p-3 bg-detective-bg-secondary rounded-lg">
                    <pre className="text-detective-small text-gray-300 whitespace-pre-wrap">
                      {selectedVersionData.changes}
                    </pre>
                  </div>
                </div>
              </DetectiveCard>

              {/* Compare Versions */}
              <DetectiveCard>
                <h4 className="text-detective-base font-semibold mb-3">Compare with:</h4>
                <select
                  className="input-detective mb-4"
                  value={compareVersion || ''}
                  onChange={(e) => setCompareVersion(e.target.value || null)}
                >
                  <option value="">Select version to compare...</option>
                  {versions
                    .filter((v) => v.id !== selectedVersion)
                    .map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.version} - {new Date(v.timestamp).toLocaleDateString('es-ES')}
                      </option>
                    ))}
                </select>

                {compareVersionData && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-detective-small text-gray-400 mb-2">
                        {selectedVersionData.version} (Selected)
                      </p>
                      <div className="p-3 bg-detective-bg-secondary rounded-lg">
                        <pre className="text-xs text-gray-300 whitespace-pre-wrap">
                          {selectedVersionData.changes}
                        </pre>
                      </div>
                    </div>
                    <div>
                      <p className="text-detective-small text-gray-400 mb-2">
                        {compareVersionData.version} (Compare)
                      </p>
                      <div className="p-3 bg-detective-bg-secondary rounded-lg">
                        <pre className="text-xs text-gray-300 whitespace-pre-wrap">{compareVersionData.changes}</pre>
                      </div>
                    </div>
                  </div>
                )}
              </DetectiveCard>

              {/* Audit Trail */}
              <DetectiveCard>
                <h4 className="text-detective-base font-semibold mb-3">Audit Trail</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-detective-bg-secondary rounded">
                    <span className="text-detective-small">Created by</span>
                    <span className="text-detective-small text-detective-orange">
                      {selectedVersionData.author}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-detective-bg-secondary rounded">
                    <span className="text-detective-small">Created at</span>
                    <span className="text-detective-small text-gray-400">
                      {new Date(selectedVersionData.timestamp).toLocaleString('es-ES')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-detective-bg-secondary rounded">
                    <span className="text-detective-small">Total changes</span>
                    <span className="text-detective-small text-gray-400">
                      {selectedVersionData.changesSummary.added +
                        selectedVersionData.changesSummary.modified +
                        selectedVersionData.changesSummary.deleted}
                    </span>
                  </div>
                </div>
              </DetectiveCard>
            </div>
          ) : (
            <DetectiveCard>
              <div className="text-center py-12 text-gray-400">
                <GitBranch className="w-12 h-12 mx-auto mb-2" />
                <p>Select a version to view details</p>
              </div>
            </DetectiveCard>
          )}
        </div>
      </div>
    </div>
  );
};
