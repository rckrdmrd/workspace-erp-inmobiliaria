import React, { useState } from 'react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { useApprovals } from '../../hooks/useContentManagement';
import { CheckCircle, XCircle, Clock, FileText, Image as ImageIcon, MessageSquare } from 'lucide-react';

export const ContentApprovalQueue: React.FC = () => {
  const { approvals, loading, approve, reject } = useApprovals();
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = async (id: string) => {
    try {
      await approve(id);
    } catch (error) {
      console.error('Approval failed:', error);
      alert('Approval failed');
    }
  };

  const handleReject = async (id: string) => {
    if (!rejectReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      await reject(id, rejectReason);
      setRejectingId(null);
      setRejectReason('');
    } catch (error) {
      console.error('Rejection failed:', error);
      alert('Rejection failed');
    }
  };

  const pendingCount = approvals.filter((a) => a.status === 'pending').length;
  const approvedCount = approvals.filter((a) => a.status === 'approved').length;
  const rejectedCount = approvals.filter((a) => a.status === 'rejected').length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'exercise':
        return <FileText className="w-5 h-5" />;
      case 'media':
        return <ImageIcon className="w-5 h-5" />;
      case 'content':
        return <MessageSquare className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <DetectiveCard>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-detective-orange border-t-transparent"></div>
        </div>
      </DetectiveCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock className="w-8 h-8 text-detective-orange" />
          <div>
            <h2 className="text-detective-subtitle">Content Approval Queue</h2>
            <p className="text-detective-small text-gray-400">{pendingCount} pending approvals</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DetectiveCard className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/30">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-detective-small text-gray-400">Pending</p>
              <p className="text-3xl font-bold text-yellow-500">{pendingCount}</p>
            </div>
          </div>
        </DetectiveCard>

        <DetectiveCard className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/30">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-detective-small text-gray-400">Approved</p>
              <p className="text-3xl font-bold text-green-500">{approvedCount}</p>
            </div>
          </div>
        </DetectiveCard>

        <DetectiveCard className="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/30">
          <div className="flex items-center gap-3">
            <XCircle className="w-8 h-8 text-red-500" />
            <div>
              <p className="text-detective-small text-gray-400">Rejected</p>
              <p className="text-3xl font-bold text-red-500">{rejectedCount}</p>
            </div>
          </div>
        </DetectiveCard>
      </div>

      {/* Approval Queue */}
      <div className="space-y-4">
        {approvals.length === 0 ? (
          <DetectiveCard>
            <div className="text-center py-12 text-gray-400">
              <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
              <p>No items in approval queue</p>
            </div>
          </DetectiveCard>
        ) : (
          approvals.map((item) => (
            <DetectiveCard
              key={item.id}
              className={
                item.status === 'pending'
                  ? 'border border-yellow-500/30'
                  : item.status === 'approved'
                  ? 'border border-green-500/30 opacity-60'
                  : 'border border-red-500/30 opacity-60'
              }
            >
              <div className="flex items-start gap-4">
                {/* Type Icon */}
                <div
                  className={`p-3 rounded-lg ${
                    item.type === 'exercise'
                      ? 'bg-blue-500/20 text-blue-500'
                      : item.type === 'media'
                      ? 'bg-purple-500/20 text-purple-500'
                      : 'bg-orange-500/20 text-orange-500'
                  }`}
                >
                  {getTypeIcon(item.type)}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-detective-base font-semibold">{item.title}</h4>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-bold ${
                            item.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'
                              : item.status === 'approved'
                              ? 'bg-green-500/20 text-green-500 border border-green-500/30'
                              : 'bg-red-500/20 text-red-500 border border-red-500/30'
                          }`}
                        >
                          {item.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-detective-small text-gray-400">
                        Submitted by <span className="text-detective-orange">{item.submittedBy}</span> on{' '}
                        {new Date(item.submittedAt).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        item.type === 'exercise'
                          ? 'bg-blue-500/20 text-blue-500'
                          : item.type === 'media'
                          ? 'bg-purple-500/20 text-purple-500'
                          : 'bg-orange-500/20 text-orange-500'
                      }`}
                    >
                      {item.type}
                    </span>
                  </div>

                  {/* Content Preview */}
                  <div className="p-3 bg-detective-bg-secondary rounded-lg mb-3">
                    <pre className="text-detective-small text-gray-400 whitespace-pre-wrap">
                      {JSON.stringify(item.content, null, 2).slice(0, 200)}
                      {JSON.stringify(item.content).length > 200 && '...'}
                    </pre>
                  </div>

                  {/* Actions */}
                  {item.status === 'pending' && (
                    <div className="flex items-center gap-2">
                      {rejectingId === item.id ? (
                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            placeholder="Rejection reason..."
                            className="input-detective flex-1"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            autoFocus
                          />
                          <DetectiveButton
                            variant="primary"

                            onClick={() => handleReject(item.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Confirm
                          </DetectiveButton>
                          <DetectiveButton variant="primary" onClick={() => setRejectingId(null)}>
                            Cancel
                          </DetectiveButton>
                        </div>
                      ) : (
                        <>
                          <DetectiveButton
                            variant="green"

                            icon={<CheckCircle className="w-4 h-4" />}
                            onClick={() => handleApprove(item.id)}
                          >
                            Approve
                          </DetectiveButton>
                          <DetectiveButton
                            variant="primary"

                            icon={<XCircle className="w-4 h-4" />}
                            onClick={() => setRejectingId(item.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Reject
                          </DetectiveButton>
                        </>
                      )}
                    </div>
                  )}

                  {/* Rejection Reason */}
                  {item.status === 'rejected' && (
                    <div className="p-2 bg-red-500/10 border border-red-500/30 rounded text-detective-small text-red-400">
                      Rejection reason: {item.content?.rejectionReason || 'No reason provided'}
                    </div>
                  )}
                </div>
              </div>
            </DetectiveCard>
          ))
        )}
      </div>

      {/* Approval History */}
      {approvals.filter((a) => a.status !== 'pending').length > 0 && (
        <DetectiveCard>
          <h3 className="text-detective-subtitle mb-4">Approval History</h3>
          <div className="space-y-2">
            {approvals
              .filter((a) => a.status !== 'pending')
              .slice(0, 5)
              .map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-detective-bg-secondary rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {item.status === 'approved' ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <div>
                      <p className="text-detective-base">{item.title}</p>
                      <p className="text-detective-small text-gray-400">by {item.submittedBy}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-semibold ${
                        item.status === 'approved' ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {item.status.toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(item.submittedAt).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </DetectiveCard>
      )}
    </div>
  );
};
