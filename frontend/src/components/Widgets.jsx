import React, { useState, useEffect } from 'react';

export function AuraCalculator() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  
  const questions = [
    { q: "HR asks: 'Where do you see yourself in 5 years?'", opts: [{ t: "Taking your job.", s: 5000 }, { t: "On a beach, unbothered.", s: 1000 }, { t: "Synergizing core deliverables.", s: -1000 }] },
    { q: "Your manager denies your PTO request. Your move:", opts: [{ t: "'Okay noted' (cries)", s: -500 }, { t: "It wasn't a request. It was a heads-up.", s: 5000 }, { t: "Call in sick that day anyway.", s: 500 }] },
    { q: "Colleague says 'Let's circle back offline'. Translation?", opts: [{ t: "We are never speaking of this again.", s: 500 }, { t: "I need to schedule a 1:1 meeting.", s: -1000 }, { t: "They hate me.", s: 0 }] }
  ];

  const handleAnswer = (points) => {
    setScore(score + points);
    setStep(step + 1);
  };

  return (
    <div className="bg-[#FDE25D] border border-gray-200 p-6 md:p-8 rounded-[2rem] shadow-sm flex flex-col h-[400px] relative overflow-hidden group hover:shadow-md transition-all">
      <h3 className="text-2xl font-black tracking-tight mb-1 text-[#111] flex items-center gap-2">Aura Calculator</h3>
      {!isPlaying ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in-global">
          <div className="text-5xl mb-4 drop-shadow-sm">💼</div>
          <h4 className="text-xl font-black leading-tight mb-3 text-[#111]">Discover your corporate vibe.</h4>
          <p className="text-sm font-bold text-[#111]/60 mb-6">Are you a CEO or an NPC?</p>
          <button onClick={() => setIsPlaying(true)} className="bg-white text-[#111] px-8 py-3.5 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-md">
            Start Quiz
          </button>
        </div>
      ) : step < questions.length ? (
        <div className="flex-1 flex flex-col justify-center animate-fade-in-global">
          <span className="text-[10px] font-black uppercase text-[#E92A39] mb-2 tracking-widest">Question {step + 1} / {questions.length}</span>
          <h4 className="text-xl font-black leading-tight mb-5 text-[#111]">{questions[step].q}</h4>
          <div className="space-y-3">
            {questions[step].opts.map((opt, i) => (
              <button key={i} onClick={() => handleAnswer(opt.s)} className="w-full text-left bg-white/60 hover:bg-white text-sm font-bold text-[#111] px-5 py-3.5 rounded-xl transition-all hover:scale-[1.02] hover:shadow-sm">
                {opt.t}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in-global">
          <p className="text-sm font-bold text-gray-700 mb-2">Final Aura Score</p>
          <div className="text-6xl font-black text-[#111] mb-4 tracking-tighter">{score > 0 ? `+${score}` : score}</div>
          <p className="text-sm font-bold leading-relaxed text-[#111] bg-white/50 p-4 rounded-xl border border-white shadow-sm">
            {score >= 5000 ? "Sigma Energy. You are the CEO now." : score > 0 ? "You will survive the corporate machine." : "Negative Aura. Confirmed Corporate NPC."}
          </p>
          <button onClick={() => { setIsPlaying(false); setStep(0); setScore(0); }} className="mt-6 text-[10px] font-black uppercase tracking-widest text-[#111] bg-white px-5 py-2.5 rounded-full hover:scale-105 transition-transform shadow-sm">Play Again</button>
        </div>
      )}
    </div>
  );
}

export function FlagGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [lastGuessCorrect, setLastGuessCorrect] = useState(null);
  
  const cards = [
    { t: "Looking for a rockstar ninja who wears many hats.", flag: "red", r: "Translation: You will do the job of 3 different people for the salary of one intern." },
    { t: "We actively encourage taking your PTO.", flag: "green", r: "Translation: Rare W. They don't want you burning out and crying in the office bathroom." },
    { t: "Salary is based on experience and passion.", flag: "red", r: "Translation: They pay in 'exposure' and occasional office pizza. Run." },
    { t: "We play hard, but we work even harder.", flag: "red", r: "Translation: You will be online at 11 PM on a Friday. The 'play' is a ping-pong table nobody uses." },
    { t: "We care about output, not hours logged.", flag: "green", r: "Translation: Massive Green Flag. No clock-watching or policing your active status on Slack." },
  ];

  const handleGuess = (guess) => {
    const isCorrect = guess === cards[index].flag;
    setLastGuessCorrect(isCorrect);
    if (isCorrect) { setScore(s => s + 100); } else { setScore(s => Math.max(0, s - 50)); }
    setRevealed(true);
  };

  const nextCard = () => { 
    setRevealed(false); setLastGuessCorrect(null);
    if (index + 1 < cards.length) { setIndex(index + 1); } else { setIsGameOver(true); }
  };

  const resetGame = () => {
    setIsPlaying(false); setIsGameOver(false); setIndex(0); setScore(0); setRevealed(false); setLastGuessCorrect(null);
  };

  const bgColor = !isPlaying || !revealed || isGameOver ? 'bg-[#111]' : (cards[index].flag === 'red' ? 'bg-[#E92A39]' : 'bg-[#10b981]');

  return (
    <div className={`${bgColor} border border-gray-200 p-6 md:p-8 rounded-[2rem] shadow-sm flex flex-col h-[400px] text-white relative group transition-colors duration-500 hover:shadow-md`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-black tracking-tight mb-1 text-white flex items-center gap-2">Red Flag or Green Flag</h3>
        </div>
        {isPlaying && !isGameOver && (
          <div className="bg-white/20 px-4 py-2 rounded-xl text-right animate-fade-in-global">
            <p className="text-[9px] uppercase tracking-widest font-bold text-white/70">Score</p>
            <p className="text-xl font-black">{score}</p>
          </div>
        )}
      </div>
      <div className="flex-1 flex flex-col items-center justify-center text-center relative">
        {!isPlaying ? (
          <div className="animate-fade-in-global w-full">
            <h4 className="text-xl font-black leading-tight mb-3 text-white">Can you spot the red flags?</h4>
            <button onClick={() => setIsPlaying(true)} className="bg-white text-[#111] px-8 py-3.5 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-md">Start Scanning</button>
          </div>
        ) : isGameOver ? (
          <div className="animate-fade-in-global w-full flex flex-col items-center">
            <h4 className="text-xl font-black leading-tight mb-3 text-white">Game Over</h4>
            <div className="text-6xl font-black text-white mb-6 tracking-tighter">{score} <span className="text-2xl opacity-50">/ 500</span></div>
            <button onClick={resetGame} className="bg-white text-[#111] px-8 py-3.5 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-md">Play Again</button>
          </div>
        ) : !revealed ? (
          <div className="animate-fade-in-global w-full">
            <span className="text-[10px] font-black uppercase text-white/50 mb-3 block tracking-widest">Card {index + 1} / {cards.length}</span>
            <div className="bg-white/10 p-6 rounded-2xl mb-6 backdrop-blur-sm min-h-[120px] flex items-center justify-center border border-white/20 shadow-inner">
              <h4 className="text-xl font-black leading-tight">"{cards[index].t}"</h4>
            </div>
            <div className="flex justify-center gap-4">
              <button onClick={() => handleGuess('red')} className="hover:scale-105 transition-transform bg-[#E92A39] text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-md">Red Flag</button>
              <button onClick={() => handleGuess('green')} className="hover:scale-105 transition-transform bg-[#10b981] text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-md">Green Flag</button>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in-global w-full flex flex-col items-center">
            {lastGuessCorrect ? (
              <span className="text-[10px] font-black uppercase tracking-widest bg-white text-black px-3 py-1 rounded-full mb-3 shadow-md">+100 CORRECT</span>
            ) : (
              <span className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-3 py-1 rounded-full mb-3 shadow-md">-50 WRONG</span>
            )}
            <p className="text-sm font-bold bg-black/20 p-5 rounded-xl leading-relaxed mb-6 border border-white/10 shadow-inner">{cards[index].r}</p>
            <button onClick={nextCard} className="bg-white text-black px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-md">
              {index + 1 < cards.length ? 'Next Phrase →' : 'See Results'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function WhackAYapper() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [moles, setMoles] = useState(Array(9).fill(null));

  useEffect(() => {
    let moleTimer;
    let countdownTimer;

    if (isPlaying && !isGameOver) {
      moleTimer = setInterval(() => {
        setMoles(prev => {
          const newMoles = [...prev];
          for(let i = 0; i < 9; i++) { if (Math.random() > 0.4) newMoles[i] = null; }
          const emptyIndices = newMoles.map((v, i) => v === null ? i : null).filter(v => v !== null);
          
          if (emptyIndices.length > 0) {
            const numToAdd = Math.floor(Math.random() * 2) + 1;
            for(let i = 0; i < numToAdd; i++) {
              if (emptyIndices.length === 0) break;
              const randIdx = Math.floor(Math.random() * emptyIndices.length);
              const gridIdx = emptyIndices[randIdx];
              emptyIndices.splice(randIdx, 1);

              const isGreen = Math.random() > 0.8;
              if (isGreen) {
                const goodWords = ["PPO", "Raise", "Paid Leave", "Bonus"];
                newMoles[gridIdx] = { type: 'green', text: goodWords[Math.floor(Math.random() * goodWords.length)] };
              } else {
                const toxicWords = ["Synergy", "Plz Fix", "ASAP", "Bandwidth", "Circle Back"];
                newMoles[gridIdx] = { type: 'red', text: toxicWords[Math.floor(Math.random() * toxicWords.length)] };
              }
            }
          }
          return newMoles;
        });
      }, 700);

      countdownTimer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) { setIsGameOver(true); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { clearInterval(moleTimer); clearInterval(countdownTimer); };
  }, [isPlaying, isGameOver]);

  const whack = (index) => {
    const mole = moles[index];
    if (!mole) return;
    if (mole.type === 'red') { setScore(s => s + 10); } else { setScore(s => Math.max(0, s - 50)); }
    setMoles(prev => { const newMoles = [...prev]; newMoles[index] = null; return newMoles; });
  };

  const startGame = () => {
    setIsPlaying(true); setIsGameOver(false); setScore(0); setTimeLeft(15); setMoles(Array(9).fill(null));
  };

  return (
    <div className="bg-[#2E73E6] border border-gray-200 p-6 md:p-8 rounded-[2rem] shadow-sm flex flex-col h-[400px] text-white relative overflow-hidden group hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-2xl font-black tracking-tight mb-1 text-white flex items-center gap-2 relative z-20">Whack-A-Yapper</h3>
        </div>
        {isPlaying && !isGameOver && (
          <div className="bg-white/20 px-3 py-1.5 rounded-xl text-right animate-fade-in-global flex gap-4">
            <div>
              <p className="text-[8px] uppercase tracking-widest font-bold text-white/70">Time</p>
              <p className="text-lg font-black">{timeLeft}s</p>
            </div>
            <div>
              <p className="text-[8px] uppercase tracking-widest font-bold text-white/70">Score</p>
              <p className="text-lg font-black">{score}</p>
            </div>
          </div>
        )}
      </div>
      
      {!isPlaying ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in-global z-20">
          <h4 className="text-xl font-black leading-tight mb-3 text-white">Smash the toxic jargon.</h4>
          <button onClick={startGame} className="bg-white text-[#2E73E6] px-8 py-3.5 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-md">
            Start Game
          </button>
        </div>
      ) : isGameOver ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in-global z-20">
          <h4 className="text-3xl font-black mb-3">Time's Up!</h4>
          <div className="text-6xl font-black text-white mb-8 tracking-tighter">{score}</div>
          <button onClick={() => setIsPlaying(false)} className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-6 py-3 rounded-full hover:bg-white hover:text-[#2E73E6] transition-colors shadow-sm">
            Main Menu
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center relative z-20 animate-fade-in-global">
          <div className="grid grid-cols-3 gap-2 w-full max-w-[240px] aspect-square mx-auto">
            {moles.map((mole, i) => (
              <div 
                key={i} 
                className="bg-white/10 rounded-2xl border border-white/10 relative overflow-hidden flex items-center justify-center cursor-pointer shadow-inner active:bg-white/5" 
                onMouseDown={() => whack(i)}
                onTouchStart={() => whack(i)}
              >
                {mole && (
                  <div className={`w-[90%] h-[90%] rounded-xl flex items-center justify-center p-1 shadow-md scale-100 transition-transform active:scale-90 animate-fade-in-global ${mole.type === 'red' ? 'bg-[#E92A39]' : 'bg-[#10b981]'}`}>
                    <span className="text-[10px] md:text-xs font-black tracking-tighter leading-none text-center break-words px-1 drop-shadow-sm">
                      {mole.text}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}