import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MessageCircle, Send, Plus, X, Leaf, Image } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

interface Post {
  id: number;
  descricao: string;
  categoria: string;
  imagem_url: string | null;
  criada_em: string;
  usuario: { id: number; nome: string };
  likes: number;
  comentarios: number;
  user_liked: boolean;
}

interface Comentario {
  id: number;
  texto: string;
  criada_em: string;
  usuario: { id: number; nome: string };
}

interface FeedSectionProps {
  userId: number;
}

const CATEGORIAS = [
  { id: 'geral', label: 'Geral', emoji: '🌍' },
  { id: 'reciclagem', label: 'Reciclagem', emoji: '♻️' },
  { id: 'agua', label: 'Água', emoji: '💧' },
  { id: 'energia', label: 'Energia', emoji: '⚡' },
  { id: 'transporte', label: 'Transporte', emoji: '🚴' },
  { id: 'alimentacao', label: 'Alimentação', emoji: '🥗' },
];

function tempoRelativo(dataStr: string): string {
  const agora = new Date();
  const data = new Date(dataStr);
  const diff = Math.floor((agora.getTime() - data.getTime()) / 1000);
  if (diff < 60) return 'agora mesmo';
  if (diff < 3600) return `há ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `há ${Math.floor(diff / 3600)}h`;
  return `há ${Math.floor(diff / 86400)} dias`;
}

function PostCard({ post, userId, onLike }: { post: Post; userId: number; onLike: (id: number) => void }) {
  const [showComments, setShowComments] = useState(false);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [novoComentario, setNovoComentario] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [sending, setSending] = useState(false);

  const cat = CATEGORIAS.find(c => c.id === post.categoria) || CATEGORIAS[0];
  const iniciais = post.usuario.nome.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  const carregarComentarios = async () => {
    if (loadingComments) return;
    setLoadingComments(true);
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/posts/${post.id}/comments`);
      const data = await res.json();
      if (res.ok) setComentarios(data);
    } catch (err) {
      console.error('Erro ao carregar comentários:', err);
    } finally {
      setLoadingComments(false);
    }
  };

  const toggleComments = () => {
    if (!showComments) carregarComentarios();
    setShowComments(!showComments);
  };

  const enviarComentario = async () => {
    if (!novoComentario.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/posts/${post.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, texto: novoComentario })
      });
      const data = await res.json();
      if (res.ok) {
        setComentarios(prev => [...prev, data.comentario]);
        setNovoComentario('');
      } else {
        toast.error('Erro ao comentar');
      }
    } catch {
      toast.error('Erro ao conectar ao servidor');
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="border-green-200 dark:border-gray-700 overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex items-center gap-3 p-4">
          <Avatar className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600">
            <AvatarFallback className="text-white text-sm font-bold">{iniciais}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="font-semibold text-gray-800 dark:text-gray-200">{post.usuario.nome}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{tempoRelativo(post.criada_em)}</div>
          </div>
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0 text-xs">
            {cat.emoji} {cat.label}
          </Badge>
        </div>

        {/* Image */}
        {post.imagem_url && (
          <div className="w-full max-h-80 overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
              src={`http://127.0.0.1:5000${post.imagem_url}`}
              alt="Publicação ecológica"
              className="w-full object-cover"
            />
          </div>
        )}

        {/* Description */}
        <div className="px-4 py-3">
          <p className="text-gray-800 dark:text-gray-200">{post.descricao}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 px-4 pb-3 border-t border-gray-100 dark:border-gray-700 pt-3">
          <button
            onClick={() => onLike(post.id)}
            className={`flex items-center gap-1.5 transition-all ${
              post.user_liked ? 'text-red-500' : 'text-gray-500 dark:text-gray-400 hover:text-red-500'
            }`}
          >
            <Heart size={20} className={post.user_liked ? 'fill-red-500' : ''} />
            <span className="text-sm">{post.likes}</span>
          </button>
          <button
            onClick={toggleComments}
            className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-green-600 transition-all"
          >
            <MessageCircle size={20} />
            <span className="text-sm">{post.comentarios}</span>
          </button>
        </div>

        {/* Comments */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-4 space-y-3">
                {loadingComments ? (
                  <div className="flex justify-center py-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                  </div>
                ) : comentarios.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-1">Nenhum comentário ainda. Sê o primeiro!</p>
                ) : (
                  comentarios.map(c => (
                    <div key={c.id} className="flex gap-2">
                      <Avatar className="w-7 h-7 bg-gradient-to-br from-green-400 to-emerald-600 flex-shrink-0">
                        <AvatarFallback className="text-white text-xs">
                          {c.usuario.nome.slice(0, 1).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg px-3 py-2 flex-1">
                        <span className="font-semibold text-sm text-gray-800 dark:text-gray-200 mr-2">{c.usuario.nome}</span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{c.texto}</span>
                      </div>
                    </div>
                  ))
                )}
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Adicionar um comentário..."
                    value={novoComentario}
                    onChange={(e) => setNovoComentario(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && enviarComentario()}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                  />
                  <Button
                    size="sm"
                    onClick={enviarComentario}
                    disabled={sending || !novoComentario.trim()}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Send size={16} />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

export function FeedSection({ userId }: FeedSectionProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filtro, setFiltro] = useState<string>('todos');
  const [isLoading, setIsLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('geral');
  const [imagem, setImagem] = useState<File | null>(null);
  const [imagemPreview, setImagemPreview] = useState<string | null>(null);
  const [posting, setPosting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const carregarFeed = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/feed/${userId}`);
      const data = await res.json();
      if (res.ok) setPosts(data);
    } catch (err) {
      console.error('Erro ao carregar feed:', err);
      toast.error('Erro ao carregar o feed');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarFeed();
  }, [userId]);

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagem(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagemPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePublicar = async () => {
    if (!descricao.trim()) {
      toast.error('Escreve uma descrição para a tua publicação!');
      return;
    }
    setPosting(true);
    try {
      const formData = new FormData();
      formData.append('user_id', String(userId));
      formData.append('descricao', descricao);
      formData.append('categoria', categoria);
      if (imagem) formData.append('imagem', imagem);

      const res = await fetch('http://127.0.0.1:5000/api/posts', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Publicação criada! +5 pontos 🌱');
        setPosts(prev => [data.post, ...prev]);
        setDescricao('');
        setCategoria('geral');
        setImagem(null);
        setImagemPreview(null);
        setShowCreatePost(false);
      } else {
        toast.error(data.erro || 'Erro ao criar publicação');
      }
    } catch {
      toast.error('Erro ao conectar ao servidor');
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (postId: number) => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      });
      const data = await res.json();
      if (res.ok) {
        setPosts(prev => prev.map(p =>
          p.id === postId
            ? { ...p, likes: data.likes, user_liked: data.acao === 'adicionado' }
            : p
        ));
      }
    } catch (err) {
      console.error('Erro ao dar like:', err);
    }
  };

  const postsFiltrados = filtro === 'todos'
    ? posts
    : posts.filter(p => p.categoria === filtro);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-green-800 dark:text-green-300">Feed Ecológico</h1>
            <p className="text-gray-600 dark:text-gray-400">Partilha as tuas ações sustentáveis</p>
          </div>
          <Button
            onClick={() => setShowCreatePost(!showCreatePost)}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
          >
            {showCreatePost ? <X size={20} /> : <Plus size={20} />}
            <span className="ml-2 hidden sm:inline">{showCreatePost ? 'Cancelar' : 'Publicar'}</span>
          </Button>
        </div>

        {/* Filtros por categoria */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFiltro('todos')}
            className={`px-3 py-1 rounded-full text-sm border transition-all ${
              filtro === 'todos'
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-green-400'
            }`}
          >
            🌍 Todos
          </button>
          {CATEGORIAS.map(cat => (
            <button
              key={cat.id}
              onClick={() => setFiltro(cat.id)}
              className={`px-3 py-1 rounded-full text-sm border transition-all ${
                filtro === cat.id
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-green-400'
              }`}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Create Post */}
      <AnimatePresence>
        {showCreatePost && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="border-green-300 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10">
              <CardContent className="p-5 space-y-4">
                <h3 className="text-green-800 dark:text-green-300 flex items-center gap-2 text-base font-semibold">
                  <Leaf size={18} /> Nova Publicação
                </h3>

                {/* Categoria */}
                <div className="flex flex-wrap gap-2">
                  {CATEGORIAS.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setCategoria(cat.id)}
                      className={`px-3 py-1 rounded-full text-sm border transition-all ${
                        categoria === cat.id
                          ? 'bg-green-600 text-white border-green-600'
                          : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-green-400'
                      }`}
                    >
                      {cat.emoji} {cat.label}
                    </button>
                  ))}
                </div>

                {/* Textarea */}
                <textarea
                  placeholder="Descreve a tua ação sustentável de hoje... 🌱"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                />

                {/* Preview da imagem */}
                {imagemPreview && (
                  <div className="relative">
                    <img src={imagemPreview} alt="Preview" className="w-full rounded-lg max-h-48 object-cover" />
                    <button
                      onClick={() => { setImagem(null); setImagemPreview(null); }}
                      className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-green-600 transition-all"
                  >
                    <Image size={20} />
                    <span className="text-sm">Adicionar foto</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImagemChange}
                    className="hidden"
                  />
                  <Button
                    onClick={handlePublicar}
                    disabled={posting || !descricao.trim()}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                  >
                    {posting
                      ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      : <Send size={16} className="mr-2" />
                    }
                    {posting ? 'A publicar...' : 'Publicar'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feed */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : postsFiltrados.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="border-green-200 dark:border-gray-700">
            <CardContent className="p-12 text-center">
              <div className="text-6xl mb-4">{filtro === 'todos' ? '🌱' : CATEGORIAS.find(c => c.id === filtro)?.emoji ?? '🌿'}</div>
              <h3 className="text-green-800 dark:text-green-300 mb-2">
                {filtro === 'todos' ? 'Nenhuma publicação ainda' : `Sem publicações de ${CATEGORIAS.find(c => c.id === filtro)?.label}`}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {filtro === 'todos' ? 'Sê o primeiro! Partilha a tua primeira ação sustentável.' : 'Sê o primeiro a publicar nesta categoria!'}
              </p>
              <Button
                onClick={() => setShowCreatePost(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white"
              >
                <Plus size={20} className="mr-2" />
                Criar publicação
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {postsFiltrados.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <PostCard post={post} userId={userId} onLike={handleLike} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
