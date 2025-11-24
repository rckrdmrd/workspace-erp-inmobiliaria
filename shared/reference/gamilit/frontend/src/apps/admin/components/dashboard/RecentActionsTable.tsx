/**
 * RecentActionsTable Component
 *
 * Table displaying recent admin actions with sorting, filtering, and pagination.
 * Shows audit log of administrative activities.
 *
 * Features:
 * - Sortable columns
 * - Pagination
 * - Search/filter by action type
 * - Action type badges
 * - Success/error indicators
 * - Details modal
 * - Export to CSV
 * - Real-time updates
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Search,
  Filter,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from 'lucide-react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { Modal } from '@shared/components/common/Modal';
import type { AdminAction } from '../../types';

interface RecentActionsTableProps {
  actions: AdminAction[];
  loading?: boolean;
  onRefresh?: () => void;
}

type SortField = 'timestamp' | 'adminName' | 'action' | 'targetType';
type SortOrder = 'asc' | 'desc';

export const RecentActionsTable: React.FC<RecentActionsTableProps> = ({
  actions,
  loading = false,
  onRefresh,
}) => {
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAction, setSelectedAction] = useState<AdminAction | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const itemsPerPage = 10;

  // ============================================================================
  // FILTERING & SORTING
  // ============================================================================

  const filteredAndSortedActions = useMemo(() => {
    let filtered = [...actions];

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (action) =>
          action.adminName.toLowerCase().includes(search) ||
          action.action.toLowerCase().includes(search) ||
          action.targetType.toLowerCase().includes(search)
      );
    }

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter((action) => action.actionType === filterType);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      // Handle date sorting
      if (sortField === 'timestamp') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [actions, searchTerm, filterType, sortField, sortOrder]);

  // Pagination
  const paginatedActions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedActions.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedActions, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedActions.length / itemsPerPage);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleViewDetails = (action: AdminAction) => {
    setSelectedAction(action);
    setShowDetailsModal(true);
  };

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Admin', 'Action', 'Target Type', 'Target ID', 'Status', 'Details'];
    const rows = filteredAndSortedActions.map((action) => [
      new Date(action.timestamp).toLocaleString(),
      action.adminName,
      action.action,
      action.targetType,
      action.targetId,
      action.success ? 'Success' : 'Failed',
      action.details,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin-actions-${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ============================================================================
  // HELPERS
  // ============================================================================

  const getActionTypeBadge = (actionType: string) => {
    const badgeColors: Record<string, string> = {
      create: 'bg-green-500/20 text-green-500 border-green-500/30',
      update: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
      delete: 'bg-red-500/20 text-red-500 border-red-500/30',
      approve: 'bg-purple-500/20 text-purple-500 border-purple-500/30',
      reject: 'bg-orange-500/20 text-orange-500 border-orange-500/30',
      suspend: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
      restore: 'bg-cyan-500/20 text-cyan-500 border-cyan-500/30',
    };

    const color = badgeColors[actionType] || 'bg-gray-500/20 text-gray-500 border-gray-500/30';

    return (
      <span className={`px-2 py-1 rounded-md text-xs font-semibold border ${color}`}>
        {actionType.toUpperCase()}
      </span>
    );
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronsUpDown className="w-4 h-4 text-gray-500" />;
    }
    return sortOrder === 'asc' ? (
      <ChevronUp className="w-4 h-4 text-detective-orange" />
    ) : (
      <ChevronDown className="w-4 h-4 text-detective-orange" />
    );
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <DetectiveCard>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-detective-subtitle">Recent Admin Actions</h3>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-detective-bg-secondary rounded-lg hover:bg-detective-bg-tertiary transition-colors"
        >
          <Download className="w-4 h-4" />
          <span className="text-detective-small">Export CSV</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search actions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-detective-bg-secondary border border-gray-700 rounded-lg text-detective-text placeholder-gray-500 focus:outline-none focus:border-detective-orange"
          />
        </div>

        {/* Type Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="pl-10 pr-8 py-2 bg-detective-bg-secondary border border-gray-700 rounded-lg text-detective-text focus:outline-none focus:border-detective-orange appearance-none"
          >
            <option value="all">All Types</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
            <option value="approve">Approve</option>
            <option value="reject">Reject</option>
            <option value="suspend">Suspend</option>
            <option value="restore">Restore</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th
                className="px-4 py-3 text-left cursor-pointer hover:bg-detective-bg-secondary transition-colors"
                onClick={() => handleSort('timestamp')}
              >
                <div className="flex items-center gap-2 text-detective-small text-gray-400">
                  <span>Timestamp</span>
                  {getSortIcon('timestamp')}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left cursor-pointer hover:bg-detective-bg-secondary transition-colors"
                onClick={() => handleSort('adminName')}
              >
                <div className="flex items-center gap-2 text-detective-small text-gray-400">
                  <span>Admin</span>
                  {getSortIcon('adminName')}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left cursor-pointer hover:bg-detective-bg-secondary transition-colors"
                onClick={() => handleSort('action')}
              >
                <div className="flex items-center gap-2 text-detective-small text-gray-400">
                  <span>Action</span>
                  {getSortIcon('action')}
                </div>
              </th>
              <th className="px-4 py-3 text-left text-detective-small text-gray-400">Type</th>
              <th
                className="px-4 py-3 text-left cursor-pointer hover:bg-detective-bg-secondary transition-colors"
                onClick={() => handleSort('targetType')}
              >
                <div className="flex items-center gap-2 text-detective-small text-gray-400">
                  <span>Target</span>
                  {getSortIcon('targetType')}
                </div>
              </th>
              <th className="px-4 py-3 text-center text-detective-small text-gray-400">Status</th>
              <th className="px-4 py-3 text-center text-detective-small text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="wait">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center">
                    <div className="flex items-center justify-center gap-2 text-gray-400">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Filter className="w-5 h-5" />
                      </motion.div>
                      <span>Loading actions...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedActions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                    No admin actions found
                  </td>
                </tr>
              ) : (
                paginatedActions.map((action, index) => (
                  <motion.tr
                    key={action.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.03 }}
                    className="border-b border-gray-800 hover:bg-detective-bg-secondary transition-colors"
                  >
                    <td className="px-4 py-3 text-detective-small">
                      {new Date(action.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-detective-small">{action.adminName}</td>
                    <td className="px-4 py-3 text-detective-small">{action.action}</td>
                    <td className="px-4 py-3">{getActionTypeBadge(action.actionType)}</td>
                    <td className="px-4 py-3 text-detective-small">
                      <div>
                        <div className="font-semibold">{action.targetType}</div>
                        {action.targetName && (
                          <div className="text-xs text-gray-500">{action.targetName}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {action.success ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleViewDetails(action)}
                        className="p-2 hover:bg-detective-bg-tertiary rounded-lg transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4 text-detective-orange" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700">
          <div className="text-detective-small text-gray-400">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredAndSortedActions.length)} of{' '}
            {filteredAndSortedActions.length} actions
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-detective-bg-secondary rounded-lg hover:bg-detective-bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-lg transition-colors ${
                      currentPage === pageNum
                        ? 'bg-detective-orange text-white'
                        : 'bg-detective-bg-secondary hover:bg-detective-bg-tertiary'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-detective-bg-secondary rounded-lg hover:bg-detective-bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Details Modal */}
      <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)}>
        {selectedAction && (
          <div className="p-6">
            <h3 className="text-detective-subtitle mb-4">Action Details</h3>
            <div className="space-y-3">
              <div>
                <span className="text-detective-small text-gray-400">Timestamp:</span>
                <p className="text-detective-base">{new Date(selectedAction.timestamp).toLocaleString()}</p>
              </div>
              <div>
                <span className="text-detective-small text-gray-400">Admin:</span>
                <p className="text-detective-base">{selectedAction.adminName}</p>
              </div>
              <div>
                <span className="text-detective-small text-gray-400">Action:</span>
                <p className="text-detective-base">{selectedAction.action}</p>
              </div>
              <div>
                <span className="text-detective-small text-gray-400">Type:</span>
                <div className="mt-1">{getActionTypeBadge(selectedAction.actionType)}</div>
              </div>
              <div>
                <span className="text-detective-small text-gray-400">Target:</span>
                <p className="text-detective-base">
                  {selectedAction.targetType} (ID: {selectedAction.targetId})
                </p>
              </div>
              <div>
                <span className="text-detective-small text-gray-400">Status:</span>
                <p className={`text-detective-base ${selectedAction.success ? 'text-green-500' : 'text-red-500'}`}>
                  {selectedAction.success ? 'Success' : 'Failed'}
                </p>
              </div>
              <div>
                <span className="text-detective-small text-gray-400">Details:</span>
                <p className="text-detective-base mt-1 p-3 bg-detective-bg-secondary rounded-lg">
                  {selectedAction.details}
                </p>
              </div>
              {selectedAction.ipAddress && (
                <div>
                  <span className="text-detective-small text-gray-400">IP Address:</span>
                  <p className="text-detective-base">{selectedAction.ipAddress}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </DetectiveCard>
  );
};
