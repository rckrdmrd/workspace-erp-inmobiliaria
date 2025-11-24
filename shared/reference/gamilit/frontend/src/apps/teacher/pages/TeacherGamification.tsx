import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import {
  Coins,
  Trophy,
  Crown,
  TrendingUp,
  TrendingDown,
  Users,
  Gift,
  AlertCircle,
  Info,
  DollarSign,
  Plus,
  Minus,
  BarChart3,
} from 'lucide-react';

interface StudentEconomyData {
  id: string;
  name: string;
  balance: number;
  earned_this_week: number;
  spent_this_week: number;
  rank: string;
  level: number;
}

interface ClassEconomyStats {
  total_circulation: number;
  average_balance: number;
  total_earned_today: number;
  total_spent_today: number;
  inflation_rate: number;
  wealth_distribution: {
    top_10_percent: number;
    bottom_50_percent: number;
  };
}

/**
 * TeacherGamification - Control de gamificación para maestros
 *
 * Permite a los maestros:
 * - Ver configuración actual de ML Coins
 * - Dar bonus de coins por clase específica
 * - Ver logros disponibles
 * - Reportes de economía de la clase
 * - Ver top estudiantes por ML Coins
 *
 * @component
 */
export default function TeacherGamification() {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [bonusAmount, setBonusAmount] = useState<number>(50);
  const [bonusReason, setBonusReason] = useState<string>('');

  // Mock data - reemplazar con datos reales del API
  const classStats: ClassEconomyStats = {
    total_circulation: 12450,
    average_balance: 498,
    total_earned_today: 850,
    total_spent_today: 620,
    inflation_rate: 2.5,
    wealth_distribution: {
      top_10_percent: 45,
      bottom_50_percent: 15,
    },
  };

  const students: StudentEconomyData[] = [
    {
      id: 's1',
      name: 'Ana García',
      balance: 850,
      earned_this_week: 250,
      spent_this_week: 100,
      rank: 'Ajaw',
      level: 12,
    },
    {
      id: 's2',
      name: 'Carlos Ruiz',
      balance: 720,
      earned_this_week: 200,
      spent_this_week: 150,
      rank: 'Nacom',
      level: 10,
    },
    {
      id: 's3',
      name: 'María López',
      balance: 650,
      earned_this_week: 180,
      spent_this_week: 80,
      rank: 'Nacom',
      level: 9,
    },
    {
      id: 's4',
      name: 'Juan Martínez',
      balance: 420,
      earned_this_week: 150,
      spent_this_week: 200,
      rank: 'Nacom',
      level: 8,
    },
    {
      id: 's5',
      name: 'Laura Sánchez',
      balance: 380,
      earned_this_week: 120,
      spent_this_week: 90,
      rank: 'Nacom',
      level: 7,
    },
  ];

  const achievements = [
    {
      id: 'ach-1',
      name: 'Primera Victoria',
      description: 'Completa tu primer ejercicio',
      reward: 50,
      unlocked_count: 22,
    },
    {
      id: 'ach-2',
      name: 'Racha de 7 días',
      description: 'Mantén una racha de 7 días consecutivos',
      reward: 100,
      unlocked_count: 8,
    },
    {
      id: 'ach-3',
      name: 'Maestro del Módulo',
      description: 'Completa un módulo al 100%',
      reward: 200,
      unlocked_count: 5,
    },
    {
      id: 'ach-4',
      name: 'Detective Experto',
      description: 'Alcanza el nivel 15',
      reward: 300,
      unlocked_count: 3,
    },
  ];

  const economyConfig = {
    earning_rates: {
      exercise_completion: 50,
      daily_login: 10,
      streak_bonus: 20,
      achievement: 100,
      perfect_score: 150,
    },
    spending_costs: {
      hint: 20,
      skip_exercise: 50,
      powerup_vision: 30,
      powerup_time: 40,
      cosmetic_item: 100,
    },
  };

  const handleGiveBonus = () => {
    if (!selectedStudent || bonusAmount <= 0) {
      toast.error('Por favor selecciona un estudiante y un monto válido', {
        duration: 3000,
        icon: '⚠️',
      });
      return;
    }

    const student = students.find((s) => s.id === selectedStudent);
    if (student) {
      const message = `Bonus de ${bonusAmount} ML Coins otorgado a ${student.name}${bonusReason ? `\nRazón: ${bonusReason}` : ''}`;
      toast.success(message, {
        duration: 4000,
        icon: '🎁',
      });
      setSelectedStudent(null);
      setBonusAmount(50);
      setBonusReason('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-detective-text">Gestión de Gamificación</h1>
        <p className="text-detective-text-secondary mt-1">
          Monitorea y controla la economía de ML Coins de tu clase
        </p>
      </div>

      {/* Economy Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DetectiveCard hoverable={false}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-detective-text-secondary mb-1">Circulación Total</p>
              <p className="text-2xl font-bold text-detective-text">
                {classStats.total_circulation.toLocaleString()}
              </p>
              <p className="text-xs text-detective-text-secondary mt-1">ML Coins en la clase</p>
            </div>
            <Coins className="w-10 h-10 text-green-500" />
          </div>
        </DetectiveCard>

        <DetectiveCard hoverable={false}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-detective-text-secondary mb-1">Balance Promedio</p>
              <p className="text-2xl font-bold text-detective-text">
                {classStats.average_balance}
              </p>
              <p className="text-xs text-detective-text-secondary mt-1">ML Coins por estudiante</p>
            </div>
            <BarChart3 className="w-10 h-10 text-blue-500" />
          </div>
        </DetectiveCard>

        <DetectiveCard hoverable={false}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-detective-text-secondary mb-1">Ganado Hoy</p>
              <p className="text-2xl font-bold text-green-500">
                +{classStats.total_earned_today}
              </p>
              <p className="text-xs text-detective-text-secondary mt-1">ML Coins ganados</p>
            </div>
            <TrendingUp className="w-10 h-10 text-green-500" />
          </div>
        </DetectiveCard>

        <DetectiveCard hoverable={false}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-detective-text-secondary mb-1">Gastado Hoy</p>
              <p className="text-2xl font-bold text-red-500">
                -{classStats.total_spent_today}
              </p>
              <p className="text-xs text-detective-text-secondary mt-1">ML Coins gastados</p>
            </div>
            <TrendingDown className="w-10 h-10 text-red-500" />
          </div>
        </DetectiveCard>
      </div>

      {/* Give Bonus Section */}
      <DetectiveCard>
        <h2 className="text-xl font-bold text-detective-text mb-4 flex items-center gap-2">
          <Gift className="w-6 h-6 text-detective-orange" />
          Otorgar Bonus de ML Coins
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-detective-text mb-2">
              Estudiante
            </label>
            <select
              value={selectedStudent || ''}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full px-4 py-2 bg-detective-bg-secondary text-detective-text rounded-lg border border-gray-700 focus:border-detective-orange focus:outline-none"
            >
              <option value="">Seleccionar estudiante...</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name} ({student.balance} ML)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-detective-text mb-2">
              Cantidad de ML Coins
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setBonusAmount(Math.max(0, bonusAmount - 10))}
                className="p-2 bg-detective-bg-secondary text-detective-text rounded-lg hover:bg-opacity-80 transition-colors"
              >
                <Minus className="w-5 h-5" />
              </button>
              <input
                type="number"
                value={bonusAmount}
                onChange={(e) => setBonusAmount(Number(e.target.value))}
                className="flex-1 px-4 py-2 bg-detective-bg-secondary text-detective-text rounded-lg border border-gray-700 focus:border-detective-orange focus:outline-none text-center"
                min="0"
              />
              <button
                onClick={() => setBonusAmount(bonusAmount + 10)}
                className="p-2 bg-detective-bg-secondary text-detective-text rounded-lg hover:bg-opacity-80 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-detective-text mb-2">
              Razón (opcional)
            </label>
            <input
              type="text"
              value={bonusReason}
              onChange={(e) => setBonusReason(e.target.value)}
              placeholder="Ej: Participación excepcional en clase"
              className="w-full px-4 py-2 bg-detective-bg-secondary text-detective-text rounded-lg border border-gray-700 focus:border-detective-orange focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <DetectiveButton onClick={handleGiveBonus} className="w-full">
              <Gift className="w-5 h-5" />
              Otorgar Bonus
            </DetectiveButton>
          </div>
        </div>
      </DetectiveCard>

      {/* Top Students */}
      <DetectiveCard>
        <h2 className="text-xl font-bold text-detective-text mb-4 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-detective-gold" />
          Top Estudiantes por ML Coins
        </h2>

        <div className="space-y-3">
          {students.map((student, index) => (
            <div
              key={student.id}
              className="flex items-center gap-4 p-4 bg-detective-bg-secondary rounded-lg hover:bg-opacity-80 transition-colors"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-detective-orange to-orange-600 text-white font-bold text-lg">
                {index + 1}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-detective-text">{student.name}</h3>
                  <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full">
                    Lvl {student.level}
                  </span>
                  <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                    {student.rank}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-detective-text-secondary">
                  <span className="flex items-center gap-1">
                    <Coins className="w-4 h-4 text-green-500" />
                    Balance: {student.balance} ML
                  </span>
                  <span className="flex items-center gap-1 text-green-500">
                    <TrendingUp className="w-4 h-4" />
                    +{student.earned_this_week} esta semana
                  </span>
                  <span className="flex items-center gap-1 text-red-500">
                    <TrendingDown className="w-4 h-4" />
                    -{student.spent_this_week} esta semana
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudent(student.id)}
                className="px-4 py-2 bg-detective-orange text-white rounded-lg hover:bg-detective-orange/90 transition-colors"
              >
                Dar Bonus
              </button>
            </div>
          ))}
        </div>
      </DetectiveCard>

      {/* Economy Configuration (Read-only for Teachers) */}
      <DetectiveCard>
        <div className="flex items-start gap-2 mb-4">
          <Info className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <h2 className="text-xl font-bold text-detective-text">Configuración de Economía</h2>
            <p className="text-sm text-detective-text-secondary">
              Solo lectura - Los administradores pueden modificar estas tasas
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-detective-text mb-3">
              Tasas de Ganancia
            </h3>
            <div className="space-y-2">
              {Object.entries(economyConfig.earning_rates).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-2 bg-detective-bg-secondary rounded"
                >
                  <span className="text-sm text-detective-text capitalize">
                    {key.replace(/_/g, ' ')}
                  </span>
                  <span className="text-sm font-semibold text-green-500">+{value} ML</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-detective-text mb-3">Costos de Gasto</h3>
            <div className="space-y-2">
              {Object.entries(economyConfig.spending_costs).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-2 bg-detective-bg-secondary rounded"
                >
                  <span className="text-sm text-detective-text capitalize">
                    {key.replace(/_/g, ' ')}
                  </span>
                  <span className="text-sm font-semibold text-red-500">-{value} ML</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DetectiveCard>

      {/* Achievements Overview */}
      <DetectiveCard>
        <h2 className="text-xl font-bold text-detective-text mb-4 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-detective-gold" />
          Logros Disponibles
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className="p-4 bg-detective-bg-secondary rounded-lg hover:bg-opacity-80 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-detective-text">
                    {achievement.name}
                  </h3>
                  <p className="text-sm text-detective-text-secondary">{achievement.description}</p>
                </div>
                <Trophy className="w-8 h-8 text-detective-gold" />
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
                <span className="text-sm text-detective-text">
                  <Users className="w-4 h-4 inline mr-1" />
                  {achievement.unlocked_count} estudiantes lo han desbloqueado
                </span>
                <span className="text-sm font-semibold text-green-500">
                  +{achievement.reward} ML
                </span>
              </div>
            </div>
          ))}
        </div>
      </DetectiveCard>

      {/* Economy Health Alert */}
      {classStats.inflation_rate > 5 && (
        <DetectiveCard>
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-500 mt-0.5" />
            <div>
              <h3 className="text-lg font-semibold text-detective-text">
                Alerta de Inflación
              </h3>
              <p className="text-sm text-detective-text-secondary mt-1">
                La tasa de inflación de ML Coins está en {classStats.inflation_rate}%. Considera
                ajustar las tasas o contactar al administrador para un rebalanceo económico.
              </p>
            </div>
          </div>
        </DetectiveCard>
      )}
    </div>
  );
}
