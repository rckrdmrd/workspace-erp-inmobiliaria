/**
 * OrganizationsTable Component
 *
 * Table for managing organizations with search, filtering, and actions.
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Building, Eye, Edit, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { apiClient } from '@/services/api/apiClient';
import type { Organization } from '../../types';

export const OrganizationsTable: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/admin/organizations');
      const data = response.data.success ? response.data.data : response.data;
      setOrganizations(data);
    } catch (error) {
      console.error('Failed to fetch organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrgs = organizations.filter((org) =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPlanBadge = (plan: string) => {
    const colors = {
      free: 'bg-gray-500/20 text-gray-500',
      basic: 'bg-amber-500/20 text-amber-500',
      premium: 'bg-blue-500/20 text-blue-500',
      pro: 'bg-blue-500/20 text-blue-500',
      enterprise: 'bg-purple-500/20 text-purple-500',
    };
    return colors[plan as keyof typeof colors] || colors.free;
  };

  const getPlanEmoji = (plan: string) => {
    const emojis = {
      free: '🔍',
      basic: '🥉',
      premium: '⭐',
      pro: '⭐',
      enterprise: '🏆',
    };
    return emojis[plan as keyof typeof emojis] || '🔍';
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-500/20 text-green-500',
      inactive: 'bg-gray-500/20 text-gray-500',
      suspended: 'bg-red-500/20 text-red-500',
    };
    return colors[status as keyof typeof colors] || colors.inactive;
  };

  return (
    <DetectiveCard>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-detective-subtitle">Organizations</h3>
          <p className="text-detective-small text-gray-400">{organizations.length} total</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search organizations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-detective-bg-secondary border border-gray-700 rounded-lg text-detective-text"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="px-4 py-3 text-left text-detective-small text-gray-400">Name</th>
              <th className="px-4 py-3 text-left text-detective-small text-gray-400">Plan</th>
              <th className="px-4 py-3 text-left text-detective-small text-gray-400">Status</th>
              <th className="px-4 py-3 text-left text-detective-small text-gray-400">Users</th>
              <th className="px-4 py-3 text-left text-detective-small text-gray-400">Created</th>
              <th className="px-4 py-3 text-center text-detective-small text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  Loading organizations...
                </td>
              </tr>
            ) : filteredOrgs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  🔍 No organizations found
                </td>
              </tr>
            ) : (
              filteredOrgs.map((org) => (
                <motion.tr
                  key={org.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-gray-800 hover:bg-detective-bg-secondary transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-gray-500" />
                      <span className="text-detective-small font-semibold">{org.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-md text-xs capitalize ${getPlanBadge(org.plan)}`}>
                      {getPlanEmoji(org.plan)} {org.plan}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-md text-xs capitalize ${getStatusBadge(org.status)}`}>
                      {org.status === 'active' ? '✅' : '❌'} {org.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-detective-small">{org.userCount}</td>
                  <td className="px-4 py-3 text-detective-small text-gray-400">
                    {new Date(org.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        to={`/admin/organizations/${org.id}`}
                        className="p-2 hover:bg-detective-bg-tertiary rounded-lg transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4 text-blue-500" />
                      </Link>
                      <Link
                        to={`/admin/organizations/${org.id}/edit`}
                        className="p-2 hover:bg-detective-bg-tertiary rounded-lg transition-colors"
                        title="Edit organization"
                      >
                        <Edit className="w-4 h-4 text-green-500" />
                      </Link>
                      {org.status !== 'suspended' && (
                        <button
                          className="p-2 hover:bg-detective-bg-tertiary rounded-lg transition-colors"
                          title="Suspend organization"
                        >
                          <XCircle className="w-4 h-4 text-red-500" />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </DetectiveCard>
  );
};
