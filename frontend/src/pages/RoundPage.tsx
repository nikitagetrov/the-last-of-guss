import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roundApi, gameApi } from '../api';
import { useAuthStore } from '../store/authStore';
import { Goose } from '../components/Goose';
import { Countdown } from '../components/Countdown';

export const RoundPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [tapCount, setTapCount] = useState(0);
  const [score, setScore] = useState(0);

  const { data: roundData, isLoading } = useQuery({
    queryKey: ['round', id],
    queryFn: () => roundApi.getRound(id!),
    refetchInterval: 2000,
    enabled: !!id,
  });

  const tapMutation = useMutation({
    mutationFn: () => gameApi.tap(id!),
    onSuccess: (data) => {
      setTapCount(data.taps);
      setScore(data.score);
      queryClient.invalidateQueries({ queryKey: ['round', id] });
    },
  });

  const round = roundData?.round;

  useEffect(() => {
    if (round) {
      setTapCount(round.userTaps || 0);
      setScore(round.userScore || 0);
    }
  }, [round]);

  if (isLoading || !round) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }

  const getStatusText = (): string => {
    switch (round.status) {
      case 'SCHEDULED':
        return 'Раунд еще не начался';
      case 'ACTIVE':
        return 'Раунд активен!';
      case 'COMPLETED':
        return 'Раунд завершен';
      default:
        return 'Неизвестный статус';
    }
  };

  const getStatusColor = (): string => {
    switch (round.status) {
      case 'SCHEDULED':
        return 'text-yellow-300';
      case 'ACTIVE':
        return 'text-green-300';
      case 'COMPLETED':
        return 'text-gray-300';
      default:
        return 'text-gray-300';
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('ru-RU');
  };

  const canTap = round.status === 'ACTIVE' && user?.role !== 'NIKITA';
  const isNikita = user?.role === 'NIKITA';

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link
            to="/"
            className="bg-white bg-opacity-20 text-white px-4 py-2 rounded hover:bg-opacity-30"
          >
            ← Назад к списку
          </Link>
          <h1 className="text-4xl font-bold text-white">
            Раунд {round.id.slice(-8)}
          </h1>
          <div className="w-24"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white bg-opacity-10 rounded-lg p-6 text-white">
            <h2 className="text-2xl font-bold mb-4">Информация о раунде</h2>
            <div className="space-y-3">
              <div>
                <span className="font-semibold">Статус: </span>
                <span className={`font-bold ${getStatusColor()}`}>
                  {getStatusText()}
                </span>
              </div>
              <div>
                <span className="font-semibold">Начало: </span>
                {formatDate(round.startTime)}
              </div>
              <div>
                <span className="font-semibold">Конец: </span>
                {formatDate(round.endTime)}
              </div>
              <div>
                <span className="font-semibold">Всего тапов: </span>
                {round.totalTaps}
              </div>
              
              {round.status === 'SCHEDULED' && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">До начала раунда:</h3>
                  <Countdown 
                    targetDate={new Date(round.startTime)}
                    className="text-white"
                  />
                </div>
              )}
              
              {round.status === 'ACTIVE' && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">До конца раунда:</h3>
                  <Countdown 
                    targetDate={new Date(round.endTime)}
                    className="text-white"
                  />
                </div>
              )}
              
              {round.winner && (
                <div className="mt-6 p-4 bg-yellow-500 bg-opacity-20 rounded">
                  <h3 className="text-lg font-semibold text-yellow-300">🏆 Победитель</h3>
                  <p className="text-yellow-100">
                    {round.winner.username} - {round.winner.score} очков
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white bg-opacity-10 rounded-lg p-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Ваша статистика</h2>
            
            {isNikita && (
              <div className="mb-4 p-4 bg-red-500 bg-opacity-20 rounded text-red-200">
                ⚠️ Никита, твои тапы не засчитываются в статистике!
              </div>
            )}
            
            <div className="space-y-4 mb-8">
              <div className="text-white">
                <div className="text-3xl font-bold">{tapCount}</div>
                <div className="text-sm opacity-75">тапов</div>
              </div>
              <div className="text-white">
                <div className="text-3xl font-bold">{score}</div>
                <div className="text-sm opacity-75">очков</div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="mb-4">
                <Goose
                  onClick={() => {
                    if (canTap || isNikita) {
                      tapMutation.mutate();
                    }
                  }}
                  disabled={!canTap && !isNikita}
                  className="w-48 h-48"
                />
              </div>
              
              {round.status === 'SCHEDULED' && (
                <p className="text-yellow-300 text-sm">
                  Тапы будут доступны после начала раунда
                </p>
              )}
              
              {round.status === 'COMPLETED' && (
                <p className="text-gray-300 text-sm">
                  Раунд завершен
                </p>
              )}
              
              {round.status === 'ACTIVE' && canTap && (
                <p className="text-green-300 text-sm animate-pulse">
                  Тапай по гусю! 🦢
                </p>
              )}
              
              {round.status === 'ACTIVE' && isNikita && (
                <p className="text-red-300 text-sm">
                  Можешь тапать, но очки не засчитываются
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white bg-opacity-10 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">Правила игры</h3>
          <div className="text-white space-y-2 text-sm">
            <p>• 1 тап = 1 очко</p>
            <p>• Каждый 11-й тап дает 10 очков</p>
            <p>• Тапать можно только во время активного раунда</p>
            <p>• Побеждает игрок с наибольшим количеством очков</p>
            <p>• Тапы Никиты не засчитываются в статистике</p>
          </div>
        </div>
      </div>
    </div>
  );
};
