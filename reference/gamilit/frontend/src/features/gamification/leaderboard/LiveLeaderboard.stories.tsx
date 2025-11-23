/**
 * LiveLeaderboard Storybook Stories
 *
 * Interactive documentation and visual testing for the LiveLeaderboard component
 * Run with: npm run storybook
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { LiveLeaderboard } from './LiveLeaderboard';
import type { LiveLeaderboardProps } from './LiveLeaderboard';

// ============================================================================
// STORY METADATA
// ============================================================================

const meta: Meta<typeof LiveLeaderboard> = {
  title: 'Gamification/Leaderboard/LiveLeaderboard',
  component: LiveLeaderboard,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# LiveLeaderboard

Complete leaderboard implementation with real-time updates and multiple ranking types.

## Features
- 4 leaderboard types: XP, Completion, Streak, Detective
- Real-time auto-refresh
- User position highlighting
- Top 3 special icons (Crown, Medal, Trophy)
- Rank change indicators
- Smooth animations
- Responsive design

## Usage
\`\`\`tsx
import { LiveLeaderboard } from '@/features/gamification/leaderboard';

function MyPage() {
  return <LiveLeaderboard userId="user-123" initialType="xp" />;
}
\`\`\`
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    userId: {
      control: 'text',
      description: 'Current user ID for highlighting',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'required' }
      }
    },
    initialType: {
      control: 'select',
      options: ['xp', 'completion', 'streak', 'detective'],
      description: 'Initial leaderboard type to display',
      table: {
        type: { summary: 'LeaderboardTypeVariant' },
        defaultValue: { summary: 'detective' }
      }
    },
    autoRefresh: {
      control: 'boolean',
      description: 'Enable automatic refresh',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' }
      }
    },
    refreshInterval: {
      control: 'number',
      description: 'Refresh interval in milliseconds',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '30000' }
      }
    },
    itemsPerPage: {
      control: 'number',
      description: 'Number of entries to display',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '20' }
      }
    },
    onUserClick: {
      action: 'user-clicked',
      description: 'Callback when user entry is clicked',
      table: {
        type: { summary: '(userId: string) => void' }
      }
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
      table: {
        type: { summary: 'string' }
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof LiveLeaderboard>;

// ============================================================================
// STORIES
// ============================================================================

/**
 * Default story - Shows the leaderboard in its default state
 */
export const Default: Story = {
  args: {
    userId: 'current-user-123',
    initialType: 'detective'
  }
};

/**
 * XP Leaderboard - Shows ranking by experience points
 */
export const XPLeaderboard: Story = {
  args: {
    userId: 'current-user-123',
    initialType: 'xp'
  },
  parameters: {
    docs: {
      description: {
        story: 'Leaderboard sorted by total XP accumulated. Shows user rankings based on experience points.'
      }
    }
  }
};

/**
 * Completion Leaderboard - Shows ranking by completion percentage
 */
export const CompletionLeaderboard: Story = {
  args: {
    userId: 'current-user-123',
    initialType: 'completion'
  },
  parameters: {
    docs: {
      description: {
        story: 'Leaderboard sorted by completion percentage. Shows how much content each user has completed.'
      }
    }
  }
};

/**
 * Streak Leaderboard - Shows ranking by consecutive days
 */
export const StreakLeaderboard: Story = {
  args: {
    userId: 'current-user-123',
    initialType: 'streak'
  },
  parameters: {
    docs: {
      description: {
        story: 'Leaderboard sorted by streak. Shows users with the longest consecutive days of activity.'
      }
    }
  }
};

/**
 * No Auto Refresh - Manual refresh only
 */
export const NoAutoRefresh: Story = {
  args: {
    userId: 'current-user-123',
    initialType: 'detective',
    autoRefresh: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Leaderboard with auto-refresh disabled. Users must manually click the refresh button.'
      }
    }
  }
};

/**
 * Fast Refresh - Updates every 10 seconds
 */
export const FastRefresh: Story = {
  args: {
    userId: 'current-user-123',
    initialType: 'detective',
    autoRefresh: true,
    refreshInterval: 10000
  },
  parameters: {
    docs: {
      description: {
        story: 'Leaderboard with faster refresh interval (10 seconds instead of default 30).'
      }
    }
  }
};

/**
 * Limited Entries - Shows only top 10
 */
export const Top10Only: Story = {
  args: {
    userId: 'current-user-123',
    initialType: 'detective',
    itemsPerPage: 10
  },
  parameters: {
    docs: {
      description: {
        story: 'Leaderboard showing only the top 10 entries.'
      }
    }
  }
};

/**
 * Top 15 - Shows top 15 entries
 */
export const Top15: Story = {
  args: {
    userId: 'current-user-123',
    initialType: 'detective',
    itemsPerPage: 15
  },
  parameters: {
    docs: {
      description: {
        story: 'Leaderboard showing 15 entries for a more compact view.'
      }
    }
  }
};

/**
 * With Click Handler - Interactive user selection
 */
export const WithClickHandler: Story = {
  args: {
    userId: 'current-user-123',
    initialType: 'detective',
    onUserClick: (userId: string) => {
      console.log('User clicked:', userId);
      alert(`Clicked on user: ${userId}`);
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Leaderboard with click handler. Clicking on a user entry triggers a callback.'
      }
    }
  }
};

/**
 * Custom Styling - With additional CSS classes
 */
export const CustomStyling: Story = {
  args: {
    userId: 'current-user-123',
    initialType: 'detective',
    className: 'max-w-6xl mx-auto p-8 bg-gray-50 rounded-2xl'
  },
  parameters: {
    docs: {
      description: {
        story: 'Leaderboard with custom styling applied via className prop.'
      }
    }
  }
};

/**
 * Mobile View - Optimized for small screens
 */
export const MobileView: Story = {
  args: {
    userId: 'current-user-123',
    initialType: 'detective',
    itemsPerPage: 10
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Leaderboard optimized for mobile viewport. Shows responsive design adaptations.'
      }
    }
  }
};

/**
 * Tablet View - Medium screen layout
 */
export const TabletView: Story = {
  args: {
    userId: 'current-user-123',
    initialType: 'detective',
    itemsPerPage: 15
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet'
    },
    docs: {
      description: {
        story: 'Leaderboard on tablet viewport. Shows layout adaptations for medium screens.'
      }
    }
  }
};

/**
 * Desktop View - Full-width layout
 */
export const DesktopView: Story = {
  args: {
    userId: 'current-user-123',
    initialType: 'detective',
    itemsPerPage: 20
  },
  parameters: {
    viewport: {
      defaultViewport: 'desktop'
    },
    docs: {
      description: {
        story: 'Leaderboard on desktop viewport. Shows full features with expanded layout.'
      }
    }
  }
};

/**
 * Dark Background - Contrasting background
 */
export const DarkBackground: Story = {
  args: {
    userId: 'current-user-123',
    initialType: 'detective'
  },
  decorators: [
    (Story) => (
      <div className="bg-gray-900 min-h-screen p-8">
        <Story />
      </div>
    )
  ],
  parameters: {
    docs: {
      description: {
        story: 'Leaderboard on a dark background. Shows contrast and readability.'
      }
    }
  }
};

/**
 * Gradient Background - Colorful background
 */
export const GradientBackground: Story = {
  args: {
    userId: 'current-user-123',
    initialType: 'xp'
  },
  decorators: [
    (Story) => (
      <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 min-h-screen p-8">
        <Story />
      </div>
    )
  ],
  parameters: {
    docs: {
      description: {
        story: 'Leaderboard on a gradient background. Shows visual appeal in different contexts.'
      }
    }
  }
};

/**
 * All Types Showcase - Side by side comparison
 */
export const AllTypesShowcase: Story = {
  render: () => (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 p-6 bg-gray-50">
      <div>
        <h3 className="text-2xl font-bold mb-4 text-center">XP Leaderboard</h3>
        <LiveLeaderboard
          userId="current-user-123"
          initialType="xp"
          itemsPerPage={10}
          autoRefresh={false}
        />
      </div>
      <div>
        <h3 className="text-2xl font-bold mb-4 text-center">Completion</h3>
        <LiveLeaderboard
          userId="current-user-123"
          initialType="completion"
          itemsPerPage={10}
          autoRefresh={false}
        />
      </div>
      <div>
        <h3 className="text-2xl font-bold mb-4 text-center">Streak</h3>
        <LiveLeaderboard
          userId="current-user-123"
          initialType="streak"
          itemsPerPage={10}
          autoRefresh={false}
        />
      </div>
      <div>
        <h3 className="text-2xl font-bold mb-4 text-center">Detective</h3>
        <LiveLeaderboard
          userId="current-user-123"
          initialType="detective"
          itemsPerPage={10}
          autoRefresh={false}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All four leaderboard types displayed side by side for comparison.'
      }
    }
  }
};

/**
 * Dashboard Integration - Example in a dashboard layout
 */
export const DashboardIntegration: Story = {
  render: () => (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Detective Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Total XP</p>
                <p className="text-2xl font-bold text-blue-600">12,450</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Completion</p>
                <p className="text-2xl font-bold text-green-600">85%</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Current Streak</p>
                <p className="text-2xl font-bold text-orange-600">24 days</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <LiveLeaderboard
              userId="current-user-123"
              initialType="detective"
              itemsPerPage={15}
            />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Example of LiveLeaderboard integrated into a dashboard layout with sidebar stats.'
      }
    }
  }
};

/**
 * Loading State - Simulated loading
 */
export const LoadingState: Story = {
  render: () => {
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
      setTimeout(() => setIsLoading(false), 3000);
    }, []);

    if (isLoading) {
      return (
        <div className="container mx-auto p-6">
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Cargando clasificación...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="container mx-auto p-6">
        <LiveLeaderboard userId="current-user-123" />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows loading state before displaying the leaderboard.'
      }
    }
  }
};

/**
 * Interactive Playground - Full control over all props
 */
export const Playground: Story = {
  args: {
    userId: 'current-user-123',
    initialType: 'detective',
    autoRefresh: true,
    refreshInterval: 30000,
    itemsPerPage: 20
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive playground to test all component props. Use the controls panel to adjust settings.'
      }
    }
  }
};
