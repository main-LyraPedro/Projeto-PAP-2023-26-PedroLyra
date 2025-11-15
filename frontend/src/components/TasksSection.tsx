import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Circle, Leaf, Droplet, Recycle, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
interface Task {
  id: number;
  title: string;
  description: string;
  points: number;
  completed: boolean;
  icon: any;
  category: 'daily' | 'weekly' | 'monthly';
}

export function TasksSection() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Separar lixo reciclável', description: 'Separe plástico, papel e vidro', points: 10, completed: false, icon: Recycle, category: 'daily' },
    { id: 2, title: 'Economizar água', description: 'Tome um banho de 5 minutos', points: 15, completed: false, icon: Droplet, category: 'daily' },
    { id: 3, title: 'Apagar luzes', description: 'Desligue luzes ao sair do ambiente', points: 5, completed: true, icon: Zap, category: 'daily' },
    { id: 4, title: 'Usar sacola reutilizável', description: 'Vá às compras com sua própria sacola', points: 20, completed: false, icon: Leaf, category: 'weekly' },
    { id: 5, title: 'Plantar uma árvore', description: 'Contribua com o reflorestamento', points: 50, completed: false, icon: Leaf, category: 'weekly' },
    { id: 6, title: 'Reduzir consumo de carne', description: 'Faça 3 refeições vegetarianas', points: 30, completed: false, icon: Leaf, category: 'weekly' },
    { id: 7, title: 'Limpar uma área pública', description: 'Organize ou participe de mutirão', points: 100, completed: false, icon: Recycle, category: 'monthly' },
    { id: 8, title: 'Educar 5 pessoas', description: 'Compartilhe dicas de sustentabilidade', points: 75, completed: false, icon: Leaf, category: 'monthly' }
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const newCompleted = !task.completed;
        if (newCompleted) {
          toast.success(`Parabéns! +${task.points} pontos 🌱`);
        }
        return { ...task, completed: newCompleted };
      }
      return task;
    }));
  };

  const getTasksByCategory = (category: 'daily' | 'weekly' | 'monthly') => {
    return tasks.filter(task => task.category === category);
  };

  const getProgress = (category: 'daily' | 'weekly' | 'monthly') => {
    const categoryTasks = getTasksByCategory(category);
    const completed = categoryTasks.filter(t => t.completed).length;
    return (completed / categoryTasks.length) * 100;
  };

  const categories = [
    { id: 'daily', name: 'Diárias', emoji: '☀️' },
    { id: 'weekly', name: 'Semanais', emoji: '📅' },
    { id: 'monthly', name: 'Mensais', emoji: '🗓️' }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-green-800 dark:text-green-300 mb-2">Minhas Tarefas</h1>
        <p className="text-gray-600 dark:text-gray-400">Complete desafios e ganhe pontos para o ranking</p>
      </motion.div>

      {categories.map((category, catIndex) => {
        const categoryTasks = getTasksByCategory(category.id as any);
        const progress = getProgress(category.id as any);
        
        return (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIndex * 0.1 }}
          >
            <Card className="border-green-200 dark:border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="dark:text-gray-200">
                      {category.emoji} {category.name}
                    </CardTitle>
                    <CardDescription className="dark:text-gray-400">
                      {categoryTasks.filter(t => t.completed).length} de {categoryTasks.length} completas
                    </CardDescription>
                  </div>
                  <Badge className="bg-green-500">{Math.round(progress)}%</Badge>
                </div>
                <Progress value={progress} className="mt-2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categoryTasks.map((task, index) => {
                    const Icon = task.icon;
                    return (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => toggleTask(task.id)}
                        className={`flex items-center gap-4 p-3 lg:p-4 rounded-lg cursor-pointer transition-all ${
                          task.completed 
                            ? 'bg-green-100 dark:bg-green-900/30 opacity-75' 
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        }`}
                      >
                        {task.completed ? (
                          <CheckCircle2 className="text-green-600 dark:text-green-400 flex-shrink-0" size={24} />
                        ) : (
                          <Circle className="text-gray-400 flex-shrink-0" size={24} />
                        )}
                        <div className="flex-1">
                          <div className={`${task.completed ? 'line-through' : ''} dark:text-gray-200`}>
                            {task.title}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{task.description}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Icon className="text-green-600 dark:text-green-400" size={20} />
                          <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                            +{task.points} pts
                          </Badge>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
