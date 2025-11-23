/**
 * SettingsPage - User Settings and Preferences
 *
 * Sections:
 * - Profile settings (avatar, display name, bio)
 * - Account settings (email, password)
 * - Preferences (theme, language, notifications)
 * - Privacy settings
 * - Connected accounts
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/providers/AuthContext';
import {
  Settings as SettingsIcon,
  User,
  Lock,
  Bell,
  Shield,
  Palette,
  Globe,
  Mail,
  Key,
  Eye,
  EyeOff,
  Save,
  Camera,
  Link as LinkIcon,
  AlertCircle,
  Check,
} from 'lucide-react';

// Components
import { GamifiedHeader } from '@shared/components/layout/GamifiedHeader';
import { useUserGamification } from '@shared/hooks/useUserGamification';
import { EnhancedCard } from '@shared/components/base/EnhancedCard';
import { ColorfulCard } from '@shared/components/base/ColorfulCard';

// Utils
import { cn } from '@shared/utils/cn';
import { getColorSchemeByIndex } from '@shared/utils/colorPalette';

type SettingsSection = 'profile' | 'account' | 'preferences' | 'privacy' | 'connected';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Use useUserGamification hook (currently with mock data until backend endpoint is ready)
  const { gamificationData } = useUserGamification(user?.id);

  // State
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Profile Settings
  const [profile, setProfile] = useState({
    displayName: user?.displayName || user?.email?.split('@')[0] || '',
    bio: '',
    avatar: '',
  });

  // Account Settings
  const [account, setAccount] = useState({
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Preferences
  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'es',
    emailNotifications: true,
    pushNotifications: true,
    achievementAlerts: true,
    friendRequests: true,
    guildInvites: true,
  });

  // Privacy Settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showOnlineStatus: true,
    allowFriendRequests: true,
    showActivity: true,
  });

  // Handle Save
  const handleSave = async () => {
    setSaveStatus('saving');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  // Handle Avatar Upload
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const sections = [
    { id: 'profile' as SettingsSection, label: 'Profile', icon: User },
    { id: 'account' as SettingsSection, label: 'Account', icon: Lock },
    { id: 'preferences' as SettingsSection, label: 'Preferences', icon: SettingsIcon },
    { id: 'privacy' as SettingsSection, label: 'Privacy', icon: Shield },
    { id: 'connected' as SettingsSection, label: 'Connected Accounts', icon: LinkIcon },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
      <GamifiedHeader
        user={user ?? undefined}
        gamificationData={gamificationData}
        onLogout={async () => {
          await logout();
          // No need to navigate - performLogout() handles redirect
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <EnhancedCard hover={false} padding="sm" variant="default">
              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;

                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium',
                        isActive
                          ? 'bg-detective-orange text-white'
                          : 'text-detective-text hover:bg-detective-bg'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{section.label}</span>
                    </button>
                  );
                })}
              </nav>
            </EnhancedCard>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {/* Profile Settings */}
            {activeSection === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <ColorfulCard index={0} hover={false} animate={false}>
                  <h2 className="text-2xl font-bold text-detective-text mb-6">Profile Settings</h2>

                  <div className="space-y-6">
                    {/* Avatar */}
                    <div>
                      <label className="block text-sm font-medium text-detective-text mb-3">
                        Profile Picture
                      </label>
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-20 h-20 bg-gradient-to-br from-detective-orange to-detective-gold rounded-full flex items-center justify-center overflow-hidden">
                            {profile.avatar ? (
                              <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-white text-2xl font-bold">
                                {profile.displayName.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <label
                            htmlFor="avatar-upload"
                            className="absolute bottom-0 right-0 w-6 h-6 bg-detective-orange text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-detective-orange-dark transition-colors"
                          >
                            <Camera className="w-4 h-4" />
                          </label>
                          <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                          />
                        </div>
                        <div>
                          <p className="text-sm text-detective-text-secondary">
                            Upload a new profile picture
                          </p>
                          <p className="text-xs text-detective-text-secondary">
                            JPG, PNG or GIF. Max size 2MB.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Display Name */}
                    <div>
                      <label className="block text-sm font-medium text-detective-text mb-2">
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={profile.displayName}
                        onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-detective-orange/30 rounded-lg focus:outline-none focus:border-detective-orange"
                      />
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-sm font-medium text-detective-text mb-2">
                        Bio
                      </label>
                      <textarea
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-detective-orange/30 rounded-lg focus:outline-none focus:border-detective-orange"
                        rows={4}
                        placeholder="Tell us about yourself..."
                      />
                      <p className="text-xs text-detective-text-secondary mt-1">
                        {profile.bio.length} / 200 characters
                      </p>
                    </div>

                    <button
                      onClick={handleSave}
                      disabled={saveStatus === 'saving'}
                      className="px-6 py-2 bg-detective-orange text-white rounded-lg hover:bg-detective-orange-dark transition-colors font-medium flex items-center gap-2"
                    >
                      {saveStatus === 'saving' ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Saving...
                        </>
                      ) : saveStatus === 'saved' ? (
                        <>
                          <Check className="w-4 h-4" />
                          Saved!
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </ColorfulCard>
              </motion.div>
            )}

            {/* Account Settings */}
            {activeSection === 'account' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <ColorfulCard index={1} hover={false} animate={false}>
                  <h2 className="text-2xl font-bold text-detective-text mb-6">Account Settings</h2>

                  <div className="space-y-6">
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-detective-text mb-2">
                        Email Address
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="email"
                          value={account.email}
                          onChange={(e) => setAccount({ ...account, email: e.target.value })}
                          className="flex-1 px-4 py-2 border-2 border-detective-orange/30 rounded-lg focus:outline-none focus:border-detective-orange"
                        />
                        <button className="px-4 py-2 bg-detective-blue text-white rounded-lg hover:bg-detective-blue-dark transition-colors font-medium">
                          Verify
                        </button>
                      </div>
                    </div>

                    <hr className="border-detective-bg" />

                    {/* Change Password */}
                    <h3 className="text-xl font-bold text-detective-text">Change Password</h3>

                    <div>
                      <label className="block text-sm font-medium text-detective-text mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={account.currentPassword}
                          onChange={(e) => setAccount({ ...account, currentPassword: e.target.value })}
                          className="w-full px-4 py-2 pr-10 border-2 border-detective-orange/30 rounded-lg focus:outline-none focus:border-detective-orange"
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-detective-text-secondary"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-detective-text mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={account.newPassword}
                        onChange={(e) => setAccount({ ...account, newPassword: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-detective-orange/30 rounded-lg focus:outline-none focus:border-detective-orange"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-detective-text mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={account.confirmPassword}
                        onChange={(e) => setAccount({ ...account, confirmPassword: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-detective-orange/30 rounded-lg focus:outline-none focus:border-detective-orange"
                      />
                    </div>

                    <button
                      onClick={handleSave}
                      className="px-6 py-2 bg-detective-orange text-white rounded-lg hover:bg-detective-orange-dark transition-colors font-medium flex items-center gap-2"
                    >
                      <Key className="w-4 h-4" />
                      Update Password
                    </button>
                  </div>
                </ColorfulCard>
              </motion.div>
            )}

            {/* Preferences */}
            {activeSection === 'preferences' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <ColorfulCard index={2} hover={false} animate={false}>
                  <h2 className="text-2xl font-bold text-detective-text mb-6">Preferences</h2>

                  <div className="space-y-6">
                    {/* Theme */}
                    <div>
                      <label className="block text-sm font-medium text-detective-text mb-2 flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        Theme
                      </label>
                      <select
                        value={preferences.theme}
                        onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-detective-orange/30 rounded-lg focus:outline-none focus:border-detective-orange"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto (System)</option>
                      </select>
                    </div>

                    {/* Language */}
                    <div>
                      <label className="block text-sm font-medium text-detective-text mb-2 flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Language
                      </label>
                      <select
                        value={preferences.language}
                        onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-detective-orange/30 rounded-lg focus:outline-none focus:border-detective-orange"
                      >
                        <option value="es">Español</option>
                        <option value="en">English</option>
                      </select>
                    </div>

                    <hr className="border-detective-bg" />

                    {/* Notifications */}
                    <h3 className="text-xl font-bold text-detective-text flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Notifications
                    </h3>

                    <div className="space-y-3">
                      {[
                        { key: 'emailNotifications', label: 'Email Notifications' },
                        { key: 'pushNotifications', label: 'Push Notifications' },
                        { key: 'achievementAlerts', label: 'Achievement Alerts' },
                        { key: 'friendRequests', label: 'Friend Requests' },
                        { key: 'guildInvites', label: 'Guild Invitations' },
                      ].map((item) => (
                        <label key={item.key} className="flex items-center justify-between p-3 bg-detective-bg rounded-lg cursor-pointer">
                          <span className="text-detective-text font-medium">{item.label}</span>
                          <input
                            type="checkbox"
                            checked={preferences[item.key as keyof typeof preferences] as boolean}
                            onChange={(e) => setPreferences({ ...preferences, [item.key]: e.target.checked })}
                            className="w-4 h-4 text-detective-orange focus:ring-detective-orange rounded"
                          />
                        </label>
                      ))}
                    </div>

                    {/* Advanced Notification Settings */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="text-sm font-bold text-blue-800 mb-2">Advanced Notification Settings</h4>
                      <p className="text-xs text-blue-700 mb-3">
                        Configure detailed preferences for each notification type and manage devices for push notifications
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate('/settings/notifications')}
                          className="px-4 py-2 bg-detective-orange text-white rounded-lg hover:bg-detective-orange-dark transition-colors font-medium text-sm"
                        >
                          Notification Preferences
                        </button>
                        <button
                          onClick={() => navigate('/settings/devices')}
                          className="px-4 py-2 bg-detective-blue text-white rounded-lg hover:bg-detective-blue-dark transition-colors font-medium text-sm"
                        >
                          Manage Devices
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleSave}
                      className="px-6 py-2 bg-detective-orange text-white rounded-lg hover:bg-detective-orange-dark transition-colors font-medium flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Preferences
                    </button>
                  </div>
                </ColorfulCard>
              </motion.div>
            )}

            {/* Privacy Settings */}
            {activeSection === 'privacy' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <ColorfulCard index={3} hover={false} animate={false}>
                  <h2 className="text-2xl font-bold text-detective-text mb-6">Privacy Settings</h2>

                  <div className="space-y-6">
                    {/* Profile Visibility */}
                    <div>
                      <label className="block text-sm font-medium text-detective-text mb-2">
                        Profile Visibility
                      </label>
                      <select
                        value={privacy.profileVisibility}
                        onChange={(e) => setPrivacy({ ...privacy, profileVisibility: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-detective-orange/30 rounded-lg focus:outline-none focus:border-detective-orange"
                      >
                        <option value="public">Public (Everyone)</option>
                        <option value="friends">Friends Only</option>
                        <option value="private">Private</option>
                      </select>
                    </div>

                    {/* Privacy Toggles */}
                    <div className="space-y-3">
                      {[
                        { key: 'showOnlineStatus', label: 'Show Online Status', description: 'Let friends see when you are online' },
                        { key: 'allowFriendRequests', label: 'Allow Friend Requests', description: 'Anyone can send you friend requests' },
                        { key: 'showActivity', label: 'Show Activity', description: 'Display your recent activities to friends' },
                      ].map((item) => (
                        <label key={item.key} className="flex items-start justify-between p-4 bg-detective-bg rounded-lg cursor-pointer">
                          <div className="flex-1">
                            <p className="text-detective-text font-medium">{item.label}</p>
                            <p className="text-sm text-detective-text-secondary mt-1">{item.description}</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={privacy[item.key as keyof typeof privacy] as boolean}
                            onChange={(e) => setPrivacy({ ...privacy, [item.key]: e.target.checked })}
                            className="w-4 h-4 text-detective-orange focus:ring-detective-orange rounded mt-1"
                          />
                        </label>
                      ))}
                    </div>

                    <button
                      onClick={handleSave}
                      className="px-6 py-2 bg-detective-orange text-white rounded-lg hover:bg-detective-orange-dark transition-colors font-medium flex items-center gap-2"
                    >
                      <Shield className="w-4 h-4" />
                      Save Privacy Settings
                    </button>
                  </div>
                </ColorfulCard>
              </motion.div>
            )}

            {/* Connected Accounts */}
            {activeSection === 'connected' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <ColorfulCard index={4} hover={false} animate={false}>
                  <h2 className="text-2xl font-bold text-detective-text mb-6">Connected Accounts</h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-detective-bg rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                          <Mail className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-detective-text">Google</p>
                          <p className="text-sm text-detective-text-secondary">Not connected</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-detective-orange text-white rounded-lg hover:bg-detective-orange-dark transition-colors font-medium">
                        Connect
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-detective-bg rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                          <LinkIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-detective-text">GitHub</p>
                          <p className="text-sm text-detective-text-secondary">Not connected</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-detective-orange text-white rounded-lg hover:bg-detective-orange-dark transition-colors font-medium">
                        Connect
                      </button>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-blue-800 font-medium">
                          Connect your accounts for easier login
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          You can sign in with any connected account without remembering your password.
                        </p>
                      </div>
                    </div>
                  </div>
                </ColorfulCard>
              </motion.div>
            )}
          </div>
        </div>

        {/* Bottom Spacing */}
        <div className="h-16" />
      </div>
    </div>
  );
}
