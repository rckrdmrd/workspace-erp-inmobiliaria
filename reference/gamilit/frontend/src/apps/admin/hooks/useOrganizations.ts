/**
 * useOrganizations Hook
 *
 * Comprehensive hook for managing organizations with CRUD operations,
 * feature flags, subscription management, and user listing.
 *
 * Features:
 * - List, create, update, delete organizations
 * - Feature flag management per organization
 * - Subscription management
 * - User listing per organization
 * - Pagination and filtering
 * - Error handling and loading states
 *
 * Updated: 2025-11-19 - Integrated with adminAPI.ts (FE-059)
 * - Now uses adminAPI methods instead of direct apiClient calls
 */

import { useState, useEffect, useCallback } from 'react';
import * as adminAPI from '@/services/api/adminAPI';
import type { Organization, OrganizationUser, PaginatedResponse } from '../types';

export interface UseOrganizationsResult {
  // Data
  organizations: Organization[];
  selectedOrganization: Organization | null;
  organizationUsers: OrganizationUser[];
  total: number;
  page: number;
  pageSize: number;

  // State
  loading: boolean;
  error: string | null;

  // CRUD Operations
  fetchOrganizations: (page?: number, pageSize?: number) => Promise<void>;
  getOrganization: (id: string) => Promise<Organization>;
  createOrganization: (data: CreateOrganizationData) => Promise<Organization>;
  updateOrganization: (id: string, data: UpdateOrganizationData) => Promise<Organization>;
  deleteOrganization: (id: string) => Promise<void>;

  // Feature Management
  updateFeatureFlags: (id: string, features: string[]) => Promise<void>;
  toggleFeature: (id: string, feature: string) => Promise<void>;

  // Subscription Management
  updateSubscription: (id: string, subscription: SubscriptionData) => Promise<void>;

  // User Management
  fetchOrganizationUsers: (id: string, page?: number, pageSize?: number) => Promise<void>;

  // Selection
  selectOrganization: (id: string | null) => void;

  // Pagination
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
}

export interface CreateOrganizationData {
  name: string;
  plan: 'free' | 'pro' | 'enterprise';
  features?: string[];
}

export interface UpdateOrganizationData {
  name?: string;
  plan?: 'free' | 'pro' | 'enterprise';
  status?: 'active' | 'inactive' | 'suspended';
}

export interface SubscriptionData {
  startDate: string;
  endDate: string;
  autoRenew: boolean;
}

export function useOrganizations(): UseOrganizationsResult {
  // State management
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [organizationUsers, setOrganizationUsers] = useState<OrganizationUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============================================================================
  // API CALLS - CRUD OPERATIONS
  // ============================================================================

  /**
   * Fetch organizations with pagination
   * Updated: Now uses adminAPI.getOrganizations()
   * Fixed: Uses items/pagination structure from PaginatedResponse
   */
  const fetchOrganizations = useCallback(
    async (newPage?: number, newPageSize?: number): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const response = await adminAPI.getOrganizations({
          page: newPage || page,
          limit: newPageSize || pageSize,
        });

        // adminAPI returns { items: T[], pagination: {...} }
        setOrganizations(response.items);
        setTotal(response.pagination.totalItems);
        if (newPage) setPage(newPage);
        if (newPageSize) setPageSize(newPageSize);
      } catch (err) {
        console.error('Failed to fetch organizations:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch organizations');
        setOrganizations([]);
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize]
  );

  /**
   * Get single organization by ID
   * Updated: Now uses adminAPI.getOrganization()
   */
  const getOrganization = useCallback(async (id: string): Promise<Organization> => {
    setLoading(true);
    setError(null);
    try {
      const org = await adminAPI.getOrganization(id);
      return org;
    } catch (err) {
      console.error('Failed to fetch organization:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch organization';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create new organization
   * Updated: Now uses adminAPI.createOrganization()
   */
  const createOrganization = useCallback(
    async (data: CreateOrganizationData): Promise<Organization> => {
      setLoading(true);
      setError(null);
      try {
        const newOrg = await adminAPI.createOrganization(data);

        // Refresh list
        await fetchOrganizations();

        return newOrg;
      } catch (err) {
        console.error('Failed to create organization:', err);
        const errorMsg = err instanceof Error ? err.message : 'Failed to create organization';
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [fetchOrganizations]
  );

  /**
   * Update organization
   * Updated: Now uses adminAPI.updateOrganization()
   */
  const updateOrganization = useCallback(
    async (id: string, data: UpdateOrganizationData): Promise<Organization> => {
      setLoading(true);
      setError(null);
      try {
        const updatedOrg = await adminAPI.updateOrganization(id, data);

        // Update local state
        setOrganizations((prev) => prev.map((org) => (org.id === id ? updatedOrg : org)));

        // Update selected if it's the one being updated
        if (selectedOrganization?.id === id) {
          setSelectedOrganization(updatedOrg);
        }

        return updatedOrg;
      } catch (err) {
        console.error('Failed to update organization:', err);
        const errorMsg = err instanceof Error ? err.message : 'Failed to update organization';
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [selectedOrganization, fetchOrganizations]
  );

  /**
   * Delete organization
   * Updated: Now uses adminAPI.deleteOrganization()
   */
  const deleteOrganization = useCallback(
    async (id: string): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        await adminAPI.deleteOrganization(id);

        // Remove from local state
        setOrganizations((prev) => prev.filter((org) => org.id !== id));

        // Clear selection if it's the deleted one
        if (selectedOrganization?.id === id) {
          setSelectedOrganization(null);
        }

        // Refresh list
        await fetchOrganizations();
      } catch (err) {
        console.error('Failed to delete organization:', err);
        const errorMsg = err instanceof Error ? err.message : 'Failed to delete organization';
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [selectedOrganization, fetchOrganizations]
  );

  // ============================================================================
  // API CALLS - FEATURE MANAGEMENT
  // ============================================================================

  /**
   * Update feature flags for organization
   * Updated: Now uses adminAPI.updateOrganizationFeatures()
   */
  const updateFeatureFlags = useCallback(
    async (id: string, features: string[]): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const updatedOrg = await adminAPI.updateOrganizationFeatures(id, { features });

        // Update local state
        setOrganizations((prev) => prev.map((org) => (org.id === id ? updatedOrg : org)));

        // Update selected if it's the one being updated
        if (selectedOrganization?.id === id) {
          setSelectedOrganization(updatedOrg);
        }
      } catch (err) {
        console.error('Failed to update feature flags:', err);
        const errorMsg = err instanceof Error ? err.message : 'Failed to update feature flags';
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [selectedOrganization]
  );

  /**
   * Toggle a single feature flag
   */
  const toggleFeature = useCallback(
    async (id: string, feature: string): Promise<void> => {
      const org = organizations.find((o) => o.id === id);
      if (!org) {
        throw new Error('Organization not found');
      }

      const currentFeatures = org.features || [];
      const newFeatures = currentFeatures.includes(feature)
        ? currentFeatures.filter((f) => f !== feature)
        : [...currentFeatures, feature];

      await updateFeatureFlags(id, newFeatures);
    },
    [organizations, updateFeatureFlags]
  );

  // ============================================================================
  // API CALLS - SUBSCRIPTION MANAGEMENT
  // ============================================================================

  /**
   * Update organization subscription
   */
  const updateSubscription = useCallback(
    async (id: string, subscription: SubscriptionData): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.patch<{ success: boolean; data: Organization }>(
          API_ENDPOINTS.admin.organizations.updateSubscription(id),
          subscription
        );
        const updatedOrg = response.data.success ? response.data.data : (response.data as unknown as Organization);

        // Update local state
        setOrganizations((prev) => prev.map((org) => (org.id === id ? updatedOrg : org)));

        // Update selected if it's the one being updated
        if (selectedOrganization?.id === id) {
          setSelectedOrganization(updatedOrg);
        }
      } catch (err) {
        console.error('Failed to update subscription:', err);
        const errorMsg = err instanceof Error ? err.message : 'Failed to update subscription';
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [selectedOrganization]
  );

  // ============================================================================
  // API CALLS - USER MANAGEMENT
  // ============================================================================

  /**
   * Fetch users for an organization
   */
  const fetchOrganizationUsers = useCallback(
    async (id: string, userPage?: number, userPageSize?: number): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get<{ success: boolean; data: PaginatedResponse<OrganizationUser> }>(
          API_ENDPOINTS.admin.organizations.users(id),
          {
            params: {
              page: userPage || 1,
              limit: userPageSize || 20,
            },
          }
        );

        const data = response.data.success
          ? response.data.data
          : (response.data as unknown as PaginatedResponse<OrganizationUser>);

        setOrganizationUsers(data.data);
      } catch (err) {
        console.error('Failed to fetch organization users:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch organization users');
        setOrganizationUsers([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ============================================================================
  // SELECTION
  // ============================================================================

  /**
   * Select an organization for detailed view
   */
  const selectOrganization = useCallback(
    async (id: string | null): Promise<void> => {
      if (id === null) {
        setSelectedOrganization(null);
        setOrganizationUsers([]);
        return;
      }

      try {
        const org = await getOrganization(id);
        setSelectedOrganization(org);

        // Also fetch users for this organization
        await fetchOrganizationUsers(id);
      } catch (err) {
        console.error('Failed to select organization:', err);
      }
    },
    [getOrganization, fetchOrganizationUsers]
  );

  // ============================================================================
  // EFFECTS
  // ============================================================================

  /**
   * Initial data fetch
   */
  useEffect(() => {
    fetchOrganizations();
  }, []);

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    // Data
    organizations,
    selectedOrganization,
    organizationUsers,
    total,
    page,
    pageSize,

    // State
    loading,
    error,

    // CRUD Operations
    fetchOrganizations,
    getOrganization,
    createOrganization,
    updateOrganization,
    deleteOrganization,

    // Feature Management
    updateFeatureFlags,
    toggleFeature,

    // Subscription Management
    updateSubscription,

    // User Management
    fetchOrganizationUsers,

    // Selection
    selectOrganization,

    // Pagination
    setPage,
    setPageSize,
  };
}
