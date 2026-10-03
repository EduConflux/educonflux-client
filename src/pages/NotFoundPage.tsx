import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { ArrowLeft, Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col items-center justify-center p-4 text-center">
      <div className="w-16 h-16 rounded-3xl bg-orange-50 text-[#F97316] flex items-center justify-center mb-4 shadow-xs">
        <Compass className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-black text-[#171717] tracking-tight mb-2">
        404 — Page Not Found
      </h1>
      <p className="text-sm text-[#737373] max-w-sm mb-6 leading-relaxed">
        The page or workspace path you are trying to reach does not exist or has been relocated.
      </p>
      <Button
        variant="primary"
        size="md"
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-xs"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home</span>
      </Button>
    </div>
  );
};
