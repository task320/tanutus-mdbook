import { useAuthStore } from '../store/useAuthStore';
import { BookOpen, Chrome } from 'lucide-react';

const Login = () => {
  const login = useAuthStore((state) => state.login);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-blue-100 rounded-full">
            <BookOpen size={48} className="text-blue-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Tanutus mdBook</h1>
        <p className="text-gray-500 mb-8">
          Markdownで本のように書ける、<br/>あなただけのデジタルノートブック
        </p>

        <button
          onClick={login}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 px-4 rounded-lg transition-colors shadow-sm"
        >
          <Chrome size={20} />
          <span>Googleでログイン</span>
        </button>
      </div>
    </div>
  );
};

export default Login;