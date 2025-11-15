import { motion } from 'motion/react';
import { Trophy, Medal, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';

interface RankingUser {
  id: number;
  name: string;
  points: number;
  level: string;
  avatar: string;
}

export function RankingSection() {
  const users: RankingUser[] = [
    { id: 1, name: 'Ana Silva', points: 2850, level: 'Eco Herói', avatar: '🌟' },
    { id: 2, name: 'Carlos Santos', points: 2640, level: 'Guardião Verde', avatar: '🌲' },
    { id: 3, name: 'Beatriz Lima', points: 2420, level: 'Protetor da Terra', avatar: '🌍' },
    { id: 4, name: 'Diego Oliveira', points: 2180, level: 'Ativista Eco', avatar: '♻️' },
    { id: 5, name: 'Elena Costa', points: 1950, level: 'Eco Warrior', avatar: '🌿' },
    { id: 6, name: 'Você', points: 1820, level: 'Defensor Verde', avatar: '🌱' },
    { id: 7, name: 'Felipe Rocha', points: 1690, level: 'Consciente', avatar: '🍃' },
    { id: 8, name: 'Gabriela Souza', points: 1540, level: 'Aprendiz Eco', avatar: '🌾' }
  ];

  const getMedalIcon = (position: number) => {
    if (position === 1) return <Trophy className="text-yellow-500" size={24} />;
    if (position === 2) return <Medal className="text-gray-400" size={24} />;
    if (position === 3) return <Award className="text-orange-600" size={24} />;
    return <span className="text-gray-500">#{position}</span>;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-green-800 dark:text-green-300 mb-2">Ranking Global</h1>
        <p className="text-gray-600 dark:text-gray-400">Veja os usuários mais engajados na comunidade</p>
      </motion.div>

      {/* Top 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {users.slice(0, 3).map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`text-center ${
              index === 0 
                ? 'border-yellow-400 dark:border-yellow-600 bg-gradient-to-b from-yellow-50 to-white dark:from-yellow-900/20 dark:to-gray-800' 
                : 'border-green-200 dark:border-gray-700'
            }`}>
              <CardHeader>
                <div className="flex justify-center mb-2">
                  {getMedalIcon(index + 1)}
                </div>
                <Avatar className="mx-auto w-16 h-16 text-2xl">
                  <AvatarFallback>{user.avatar}</AvatarFallback>
                </Avatar>
                <CardTitle className="dark:text-gray-200">{user.name}</CardTitle>
                <CardDescription className="dark:text-gray-400">{user.level}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-green-600 dark:text-green-400">{user.points} pontos</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Rest of ranking */}
      <Card className="border-green-200 dark:border-gray-700">
        <CardContent className="p-4 lg:p-6">
          <div className="space-y-3">
            {users.slice(3).map((user, index) => {
              const position = index + 4;
              const isCurrentUser = user.name === 'Você';
              
              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center gap-4 p-3 lg:p-4 rounded-lg transition-all ${
                    isCurrentUser 
                      ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-400 dark:border-green-600' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <div className="w-8 text-center">
                    {getMedalIcon(position)}
                  </div>
                  <Avatar>
                    <AvatarFallback>{user.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="dark:text-gray-200">{user.name}</span>
                      {isCurrentUser && <Badge className="bg-green-500">Você</Badge>}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{user.level}</p>
                  </div>
                  <div className="text-green-600 dark:text-green-400">
                    {user.points} pts
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
