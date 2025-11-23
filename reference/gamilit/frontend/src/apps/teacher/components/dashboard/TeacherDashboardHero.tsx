import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  BookOpen,
  ClipboardCheck,
  TrendingUp,
  Award,
} from 'lucide-react';
import type { TeacherStats } from '../../types';

interface TeacherDashboardHeroProps {
  teacherName: string;
  stats: TeacherStats;
  loading?: boolean;
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number | string;
  subtitle: string;
  colorClass: string;
  index: number;
}

// Animated counter component
const AnimatedCounter: React.FC<{
  end: number;
  duration?: number;
  decimals?: number;
}> = ({ end, duration = 2000, decimals = 0 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(end * easeOutQuart);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration]);

  return <>{count.toFixed(decimals)}</>;
};

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  label,
  value,
  subtitle,
  colorClass,
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{label}</p>
          <div className="flex items-baseline gap-2">
            <motion.p
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1 + 0.3,
                type: "spring",
                stiffness: 100
              }}
              className={`text-4xl font-bold ${colorClass}`}
            >
              {typeof value === 'number' ? (
                <>
                  <AnimatedCounter end={value} decimals={label.includes('Performance') ? 1 : 0} />
                  {label.includes('Performance') && '%'}
                </>
              ) : (
                value
              )}
            </motion.p>
          </div>
          <p className="text-xs text-gray-500 mt-2">{subtitle}</p>
        </div>
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            duration: 0.6,
            delay: index * 0.1 + 0.2,
            type: "spring"
          }}
          className={`p-3 rounded-full ${colorClass.replace('text-', 'bg-').replace('500', '100')}`}
        >
          <Icon className={`w-6 h-6 ${colorClass}`} />
        </motion.div>
      </div>
    </motion.div>
  );
};

// Skeleton loader for stats
const StatCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
          <div className="h-10 bg-gray-300 rounded w-20 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-32"></div>
        </div>
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  );
};

export const TeacherDashboardHero: React.FC<TeacherDashboardHeroProps> = ({
  teacherName,
  stats,
  loading = false,
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const statCards = [
    {
      icon: BookOpen,
      label: 'Total Classrooms',
      value: stats.totalClassrooms,
      subtitle: 'Active learning spaces',
      colorClass: 'text-blue-500',
    },
    {
      icon: Users,
      label: 'Total Students',
      value: stats.totalStudents,
      subtitle: 'Enrolled learners',
      colorClass: 'text-green-500',
    },
    {
      icon: ClipboardCheck,
      label: 'Pending Submissions',
      value: stats.pendingSubmissions,
      subtitle: 'Awaiting grading',
      colorClass: 'text-orange-500',
    },
    {
      icon: TrendingUp,
      label: 'Average Performance',
      value: stats.averagePerformance,
      subtitle: 'Class performance',
      colorClass: 'text-purple-500',
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 mb-8 shadow-2xl">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            {getGreeting()}, {teacherName}!
          </h1>
          <p className="text-blue-100 text-lg">
            Here's your classroom overview for today
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <StatCardSkeleton key={i} />
              ))}
            </>
          ) : (
            statCards.map((stat, index) => (
              <StatCard key={stat.label} {...stat} index={index} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
