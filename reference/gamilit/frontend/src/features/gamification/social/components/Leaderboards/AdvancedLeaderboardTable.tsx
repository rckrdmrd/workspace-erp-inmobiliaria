/**
 * AdvancedLeaderboardTable Component
 *
 * Enhanced table view with advanced features
 * Features:
 * - Sortable columns
 * - Pagination (50 per page)
 * - User row highlighting
 * - Rank change indicators
 * - Medal icons for top 3
 * - Jump to user position
 * - Virtual scrolling for performance
 * - Empty states
 */

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Crown,
  Medal,
  Award,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Target,
  ArrowUp,
  User
} from 'lucide-react';
import type { LeaderboardEntry } from '../../types/leaderboardsTypes';
import { RankChangeIndicator } from './RankChangeIndicator';
import { cn } from '@shared/utils/cn';

interface AdvancedLeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  onUserClick?: (userId: string) => void;
  showTopThreeInPodium?: boolean;
  itemsPerPage?: number;
  className?: string;
}

type SortColumn = 'rank' | 'username' | 'xp' | 'mlCoins' | 'change';
type SortDirection = 'asc' | 'desc';

interface ColumnConfig {
  key: SortColumn;
  label: string;
  sortable: boolean;
  align?: 'left' | 'center' | 'right';
  hideOnMobile?: boolean;
}

const columns: ColumnConfig[] = [
  { key: 'rank', label: 'Rango', sortable: true, align: 'center' },
  { key: 'username', label: 'Usuario', sortable: true, align: 'left' },
  { key: 'xp', label: 'XP', sortable: true, align: 'right', hideOnMobile: true },
  { key: 'mlCoins', label: 'ML Coins', sortable: true, align: 'right', hideOnMobile: true },
  { key: 'change', label: 'Cambio', sortable: true, align: 'center', hideOnMobile: true },
];

const getRankIcon = (rank: number) => {
  if (rank === 1) return Crown;
  if (rank === 2) return Medal;
  if (rank === 3) return Award;
  return null;
};

const getRankColor = (rank: number): string => {
  if (rank === 1) return 'text-yellow-500';
  if (rank === 2) return 'text-gray-400';
  if (rank === 3) return 'text-orange-500';
  return 'text-detective-text';
};

export const AdvancedLeaderboardTable: React.FC<AdvancedLeaderboardTableProps> = ({
  entries,
  currentUserId,
  onUserClick,
  showTopThreeInPodium = true,
  itemsPerPage = 50,
  className
}) => {
  const [sortColumn, setSortColumn] = useState<SortColumn>('rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [highlightUserId, setHighlightUserId] = useState<string | null>(null);
  const userRowRef = useRef<HTMLTableRowElement>(null);

  // Filter entries if showing top 3 in podium
  const displayEntries = showTopThreeInPodium
    ? entries.filter(e => e.rank > 3)
    : entries;

  // Sorting logic
  const sortedEntries = useMemo(() => {
    const sorted = [...displayEntries].sort((a, b) => {
      let comparison = 0;

      switch (sortColumn) {
        case 'rank':
          comparison = a.rank - b.rank;
          break;
        case 'username':
          comparison = a.username.localeCompare(b.username);
          break;
        case 'xp':
          comparison = a.xp - b.xp;
          break;
        case 'mlCoins':
          comparison = a.mlCoins - b.mlCoins;
          break;
        case 'change':
          comparison = a.change - b.change;
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [displayEntries, sortColumn, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedEntries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEntries = sortedEntries.slice(startIndex, endIndex);

  // Handle column sort
  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Jump to user position
  const handleJumpToUser = () => {
    if (!currentUserId) return;

    const userIndex = sortedEntries.findIndex(e => e.userId === currentUserId);
    if (userIndex === -1) return;

    const userPage = Math.floor(userIndex / itemsPerPage) + 1;
    setCurrentPage(userPage);
    setHighlightUserId(currentUserId);

    setTimeout(() => {
      userRowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

    setTimeout(() => setHighlightUserId(null), 3000);
  };

  // Find current user entry
  const currentUserEntry = entries.find(e => e.userId === currentUserId);
  const userIsInCurrentPage = paginatedEntries.some(e => e.userId === currentUserId);

  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <User className="w-16 h-16 text-detective-text-secondary mx-auto mb-4" />
          <h3 className="text-xl font-bold text-detective-text mb-2">
            No hay datos disponibles
          </h3>
          <p className="text-detective-text-secondary">
            No se encontraron entradas para este período
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Jump to Position Button */}
      {currentUserEntry && !userIsInCurrentPage && (
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleJumpToUser}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-detective-orange text-white rounded-lg font-semibold hover:bg-detective-orange-dark transition-colors shadow-md"
        >
          <Target className="w-5 h-5" />
          <span>Ir a mi posición (#{currentUserEntry.rank})</span>
        </motion.button>
      )}

      {/* Table Container */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-detective-blue to-detective-orange text-white">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={cn(
                      'px-4 py-4 font-bold text-sm',
                      column.hideOnMobile && 'hidden md:table-cell',
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right',
                      column.align === 'left' && 'text-left',
                      column.sortable && 'cursor-pointer select-none hover:bg-white/10 transition-colors'
                    )}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className={cn(
                      'flex items-center gap-2',
                      column.align === 'center' && 'justify-center',
                      column.align === 'right' && 'justify-end'
                    )}>
                      <span>{column.label}</span>
                      {column.sortable && (
                        <span>
                          {sortColumn === column.key ? (
                            sortDirection === 'asc' ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )
                          ) : (
                            <ChevronsUpDown className="w-4 h-4 opacity-50" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              <AnimatePresence mode="popLayout">
                {paginatedEntries.map((entry, index) => {
                  const isCurrentUser = entry.userId === currentUserId;
                  const isHighlighted = entry.userId === highlightUserId;
                  const Icon = getRankIcon(entry.rank);
                  const rankColor = getRankColor(entry.rank);

                  return (
                    <motion.tr
                      key={entry.userId}
                      ref={isCurrentUser ? userRowRef : undefined}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => onUserClick?.(entry.userId)}
                      className={cn(
                        'border-b border-gray-100 transition-all',
                        isCurrentUser && 'bg-detective-orange/10 border-detective-orange border-l-4',
                        isHighlighted && 'animate-pulse',
                        !isCurrentUser && 'hover:bg-detective-bg cursor-pointer',
                        entry.rank <= 10 && !isCurrentUser && 'bg-gradient-to-r from-purple-50/30 to-transparent'
                      )}
                    >
                      {/* Rank */}
                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {Icon ? (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: 'spring', bounce: 0.5 }}
                            >
                              <Icon className={cn('w-6 h-6', rankColor)} />
                            </motion.div>
                          ) : (
                            <span className={cn('font-bold text-lg', rankColor)}>
                              {entry.rank}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* User Info */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <motion.img
                            src={entry.avatar}
                            alt={entry.username}
                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                            whileHover={{ scale: 1.1 }}
                            onError={(e) => {
                              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.username)}&background=f97316&color=fff`;
                            }}
                          />
                          <div className="min-w-0">
                            <p className={cn(
                              'font-semibold truncate',
                              isCurrentUser ? 'text-detective-orange' : 'text-detective-text'
                            )}>
                              {entry.username}
                              {isCurrentUser && (
                                <span className="ml-2 text-xs bg-detective-orange text-white px-2 py-0.5 rounded-full">
                                  Tú
                                </span>
                              )}
                            </p>
                            <p className="text-sm text-detective-text-secondary truncate">
                              {entry.rankBadge}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* XP */}
                      <td className="px-4 py-4 text-right hidden md:table-cell">
                        <span className="font-bold text-detective-text">
                          {entry.xp.toLocaleString()}
                        </span>
                      </td>

                      {/* ML Coins */}
                      <td className="px-4 py-4 text-right hidden md:table-cell">
                        <span className="font-semibold text-detective-gold">
                          {entry.mlCoins.toLocaleString()}
                        </span>
                      </td>

                      {/* Change */}
                      <td className="px-4 py-4 text-center hidden md:table-cell">
                        <div className="flex justify-center">
                          <RankChangeIndicator
                            change={entry.change}
                            changeType={entry.changeType}

                          />
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-gray-200 px-4 py-4 bg-detective-bg">
            <div className="flex items-center justify-between">
              <div className="text-sm text-detective-text-secondary">
                Mostrando {startIndex + 1} - {Math.min(endIndex, sortedEntries.length)} de {sortedEntries.length}
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg font-semibold bg-white text-detective-text hover:bg-detective-orange hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-detective-text"
                >
                  Anterior
                </motion.button>

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
                      <motion.button
                        key={pageNum}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setCurrentPage(pageNum)}
                        className={cn(
                          'w-10 h-10 rounded-lg font-bold transition-colors',
                          currentPage === pageNum
                            ? 'bg-detective-orange text-white'
                            : 'bg-white text-detective-text hover:bg-detective-bg'
                        )}
                      >
                        {pageNum}
                      </motion.button>
                    );
                  })}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg font-semibold bg-white text-detective-text hover:bg-detective-orange hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-detective-text"
                >
                  Siguiente
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
