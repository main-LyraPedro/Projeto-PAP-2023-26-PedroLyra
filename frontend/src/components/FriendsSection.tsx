import { useState } from 'react';
import { motion } from 'motion/react';
import { UserPlus, MessageCircle, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';

interface Friend {
  id: number;
  name: string;
  level: string;
  points: number;
  status: 'online' | 'offline';
  avatar: string;
}

export function FriendsSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [friends] = useState<Friend[]>([
    { id: 1, name: 'Ana Silva', level: 'Eco Herói', points: 2850, status: 'online', avatar: '🌟' },
    { id: 2, name: 'Carlos Santos', level: 'Guardião Verde', points: 2640, status: 'online', avatar: '🌲' },
    { id: 3, name: 'Beatriz Lima', level: 'Protetor da Terra', points: 2420, status: 'offline', avatar: '🌍' },
    { id: 4, name: 'Diego Oliveira', level: 'Ativista Eco', points: 2180, status: 'online', avatar: '♻️' },
    { id: 5, name: 'Elena Costa', level: 'Eco Warrior', points: 1950, status: 'offline', avatar: '🌿' },
    { id: 6, name: 'Felipe Rocha', level: 'Consciente', points: 1690, status: 'online', avatar: '🍃' },
    { id: 7, name: 'Gabriela Souza', level: 'Aprendiz Eco', points: 1540, status: 'offline', avatar: '🌾' }
  ]);

  const [suggestions] = useState<Friend[]>([
    { id: 101, name: 'Lucas Ferreira', level: 'Defensor Verde', points: 1820, status: 'online', avatar: '🌱' },
    { id: 102, name: 'Maria Oliveira', level: 'Eco Warrior', points: 1900, status: 'offline', avatar: '🌸' },
    { id: 103, name: 'Pedro Costa', level: 'Ativista Eco', points: 2100, status: 'online', avatar: '🌳' }
  ]);

  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddFriend = (friendName: string) => {
    toast.success(`Convite enviado para ${friendName}! 🌱`);
  };

  const handleMessage = (friendName: string) => {
    toast.info(`Abrindo conversa com ${friendName}...`);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-green-800 dark:text-green-300 mb-2">Meus Amigos</h1>
        <p className="text-gray-600 dark:text-gray-400">Conecte-se com outros eco-warriors</p>
      </motion.div>

      {/* Search */}
      <Card className="border-green-200 dark:border-gray-700">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Buscar amigos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* Friends list */}
      <Card className="border-green-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-gray-200">Amigos ({friends.length})</CardTitle>
          <CardDescription className="dark:text-gray-400">
            {friends.filter(f => f.status === 'online').length} online agora
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredFriends.map((friend, index) => (
              <motion.div
                key={friend.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 p-3 lg:p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all"
              >
                <div className="relative">
                  <Avatar>
                    <AvatarFallback>{friend.avatar}</AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${
                    friend.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="dark:text-gray-200">{friend.name}</span>
                    {friend.status === 'online' && (
                      <Badge className="bg-green-500 text-xs">Online</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {friend.level} • {friend.points} pontos
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMessage(friend.name)}
                  className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <MessageCircle size={16} />
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Suggestions */}
      <Card className="border-green-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-gray-200">Sugestões de Amigos</CardTitle>
          <CardDescription className="dark:text-gray-400">
            Pessoas que você pode conhecer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {suggestions.map((person, index) => (
              <motion.div
                key={person.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 p-3 lg:p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all"
              >
                <Avatar>
                  <AvatarFallback>{person.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="dark:text-gray-200">{person.name}</div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {person.level} • {person.points} pontos
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddFriend(person.name)}
                  className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <UserPlus size={16} />
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
