'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLevelStore } from '../../store/levelStore';
import { QuizStage } from '../../types/game';
import { toast } from 'sonner';
import { Check, X, ArrowRight, Sparkles } from 'lucide-react';

export default function QuizView({ data }: { data: QuizStage }) {
  const { nextStage, loseHeart } = useLevelStore();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isChecked, setIsChecked] = useState(false);

  const handleCheck = () => {
    if (!selectedOption) return;
    setIsChecked(true);
    const isCorrect = String(selectedOption) === String(data.correctAnswer);

    if (isCorrect) {
      toast.success('Correct!', { icon: '🎉' });
      setTimeout(nextStage, 1000);
    } else {
      toast.error('Incorrect', { icon: '💔' });
      loseHeart();
      setTimeout(() => {
        setIsChecked(false);
        setSelectedOption(null);
      }, 1500);
    }
  };

  return (
    <div className="w-full min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl flex flex-col gap-8 md:gap-12">
        
        {/* Question Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-2">
          <div className="text-indigo-500 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
            <Sparkles size={14} /> Question
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold px-4">{data.question}</h2>
        </motion.div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {data.options.map((option, index) => {
            const isSelected = selectedOption === option;
            const isCorrect = isChecked && option === data.correctAnswer;
            const isWrong = isChecked && isSelected && option !== data.correctAnswer;

            return (
              <motion.button
                key={index}
                onClick={() => !isChecked && setSelectedOption(option)}
                disabled={isChecked}
                className={`flex items-center p-5 rounded-2xl border-2 transition-all ${
                  isSelected ? 'border-indigo-500 bg-indigo-500/5' : 'border-border bg-card'
                } ${isCorrect ? 'border-emerald-500!' : isWrong ? 'border-red-500!' : ''}`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${
                  isSelected ? 'border-indigo-500' : 'border-border'
                } ${isCorrect ? 'border-emerald-500! bg-emerald-500 text-white' : isWrong ? 'border-red-500! bg-red-500 text-white' : ''}`}>
                  {isCorrect && <Check size={14} strokeWidth={3} />}
                  {isWrong && <X size={14} strokeWidth={3} />}
                </div>
                <span className="text-lg font-medium">{option}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Floating Action Button */}
      <AnimatePresence>
        {selectedOption && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-0 w-full flex justify-center px-4 z-50"
          >
            <button
              onClick={handleCheck}
              disabled={isChecked}
              className={`w-full max-w-sm py-4 rounded-full font-bold text-lg shadow-xl flex items-center justify-center gap-2 ${
                isChecked ? 'bg-muted text-muted-foreground' : 'bg-indigo-600 text-white hover:scale-105'
              }`}
            >
              Confirm Answer {!isChecked && <ArrowRight size={20} />}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}