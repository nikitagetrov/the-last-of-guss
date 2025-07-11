import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roundApi, authApi } from '../api';
import { useAuthStore } from '../store/authStore';
import { Round } from '../types';

export const RoundsPage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: roundsData, isLoading } = useQuery({
    queryKey: ['rounds'],
    queryFn: roundApi.getRounds,
    refetchInterval: 60000,
  });

  const createRoundMutation = useMutation({
    mutationFn: roundApi.createRound,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['rounds'] });
      window.location.href = `/round/${data.roundId}`;
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logout();
      window.location.href = '/login';
    },
    onError: () => {
      logout();
      window.location.href = '/login';
    }
  });

  const getStatusText = (round: Round): string => {
    switch (round.status) {
      case 'SCHEDULED':
        return 'Запланирован';
      case 'ACTIVE':
        return 'Активен';
      case 'COMPLETED':
        return 'Завершен';
      default:
        return 'Неизвестно';
    }
  };

  const getStatusColor = (round: Round): string => {
    switch (round.status) {
      case 'SCHEDULED':
        return 'bg-yellow-100 text-yellow-800';
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('ru-RU');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }

  const rounds = roundsData?.rounds || [];
  const activeRounds = rounds.filter(r => r.status === 'ACTIVE' || r.status === 'SCHEDULED');
  const completedRounds = rounds.filter(r => r.status === 'COMPLETED');

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">The Last of Guss</h1>
          <div className="flex items-center space-x-4">
            <span className="text-white">
              Привет, {user?.username}! ({user?.role})
            </span>
            <button
              onClick={() => logoutMutation.mutate()}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Выйти
            </button>
          </div>
        </div>

        {user?.role === 'ADMIN' && (
          <div className="mb-8">
            <button
              onClick={() => createRoundMutation.mutate()}
              disabled={createRoundMutation.isPending}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold"
            >
              {createRoundMutation.isPending ? 'Создание...' : 'Создать раунд'}
            </button>
          </div>
        )}

        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Активные и запланированные раунды</h2>
            {activeRounds.length === 0 ? (
              <div className="bg-white bg-opacity-10 rounded-lg p-6 text-white text-center">
                Нет активных раундов
              </div>
            ) : (
              <div className="grid gap-4">
                {activeRounds.map((round) => (
                  <Link
                    key={round.id}
                    to={`/round/${round.id}`}
                    className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow block"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          Раунд {round.id.slice(-8)}
                        </h3>
                        <div className="space-y-1 text-gray-600">
                          <p>Начало: {formatDate(round.startTime)}</p>
                          <p>Конец: {formatDate(round.endTime)}</p>
                          <p>Всего тапов: {round.totalTaps}</p>
                          {round.userScore !== undefined && (
                            <p>Ваши очки: {round.userScore}</p>
                          )}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(round)}`}>
                        {getStatusText(round)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Завершенные раунды</h2>
            {completedRounds.length === 0 ? (
              <div className="bg-white bg-opacity-10 rounded-lg p-6 text-white text-center">
                Нет завершенных раундов
              </div>
            ) : (
              <div className="grid gap-4">
                {completedRounds.slice(0, 10).map((round) => (
                  <Link
                    key={round.id}
                    to={`/round/${round.id}`}
                    className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow block opacity-75"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          Раунд {round.id.slice(-8)}
                        </h3>
                        <div className="space-y-1 text-gray-600">
                          <p>Завершен: {formatDate(round.endTime)}</p>
                          <p>Всего тапов: {round.totalTaps}</p>
                          {round.winner && (
                            <p className="font-semibold text-green-600">
                              Победитель: {round.winner.username} ({round.winner.score} очков)
                            </p>
                          )}
                          {round.userScore !== undefined && (
                            <p>Ваши очки: {round.userScore}</p>
                          )}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(round)}`}>
                        {getStatusText(round)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
