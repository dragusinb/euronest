import { useState } from 'react';
import { Lock, CheckCircle, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { validateAccessCode } from '../utils/accessCodes';
import { useAccessStore } from '../store/accessStore';

interface AccessCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AccessCodeModal({ isOpen, onClose }: AccessCodeModalProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const activate = useAccessStore(s => s.activate);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!code.trim() || loading) return;

    setLoading(true);
    setError('');

    const result = await validateAccessCode(code);

    if (result) {
      activate(result);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setCode('');
        onClose();
        navigate('/explore');
      }, 1500);
    } else {
      setError('Invalid access code. Please check and try again.');
    }

    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative shadow-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer border-0 bg-transparent"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900">Access granted!</h3>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-7 h-7 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter Access Code</h2>
              <p className="text-sm text-gray-500">
                Enter your access code to unlock all EuroNest features
              </p>
            </div>

            {/* Input */}
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              onKeyDown={handleKeyDown}
              placeholder="XXXX-XXXX-XXXX"
              className="w-full px-4 py-3 text-lg text-center font-mono uppercase border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3"
              autoFocus
            />

            {/* Error */}
            {error && (
              <p className="text-sm text-red-600 text-center mb-3">{error}</p>
            )}

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={loading || !code.trim()}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer border-0 flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Validating...
                </>
              ) : (
                'Activate'
              )}
            </button>

            {/* Footer links */}
            <div className="mt-6 pt-5 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500 mb-3">Don't have a code?</p>
              <div className="flex flex-col gap-2">
                <a
                  href="https://www.lightly.ro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium no-underline hover:underline"
                >
                  Get it free with Lightly.ro
                </a>
                <a
                  href="/#pricing"
                  className="text-sm text-gray-600 hover:text-gray-800 font-medium no-underline hover:underline"
                >
                  Buy access for 150 RON
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
