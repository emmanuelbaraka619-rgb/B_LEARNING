import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { generateLearningMaterials, SummaryResult, askChatbot, ChatMessage } from '../services/geminiService';
import { db } from '../firebase';
import { collection, addDoc, doc, updateDoc, increment } from 'firebase/firestore';
import { UploadCloud, FileText, Layers, Target, Loader2, CheckCircle2, Trophy, File as FileIcon, X, Share2, Twitter, Linkedin, Facebook, MessageCircle, Send, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import confetti from 'canvas-confetti';

export default function Dashboard() {
  const { user, userData, refreshUserData } = useAuth();
  const [notes, setNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [activeTab, setActiveTab] = useState<'summary' | 'flashcards' | 'quiz'>('summary');
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  
  // Chatbot state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading || !result) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', parts: [{ text: userMessage }] }]);
    setIsChatLoading(true);

    try {
      const context = notes || (selectedFile ? `File: ${selectedFile.name}` : '') + '\n\nSummary:\n' + result.summary;
      const response = await askChatbot(context, chatMessages, userMessage);
      setChatMessages(prev => [...prev, { role: 'model', parts: [{ text: response }] }]);
    } catch (error) {
      console.error('Failed to send message:', error);
      setChatMessages(prev => [...prev, { role: 'model', parts: [{ text: 'Sorry, I encountered an error. Please try again.' }] }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const shareToSocial = (platform: 'twitter' | 'linkedin' | 'facebook', type: 'summary' | 'quiz') => {
    const appUrl = window.location.origin;
    let text = '';
    
    if (type === 'summary') {
      text = `I just generated an amazing AI summary for my notes on B_LEARNING! 🧠✨ Check out the platform here:`;
    } else {
      text = `I just scored ${score}/${result?.quiz.length} on my AI-generated quiz on B_LEARNING! 🏆 Can you beat my score?`;
    }

    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(appUrl);

    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
        break;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShowShareMenu(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const validTypes = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const validExtensions = ['.pdf', '.txt', '.doc', '.docx'];
      const isValid = validTypes.includes(file.type) || validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
      
      if (isValid) {
        setSelectedFile(file);
      } else {
        alert("Please upload a valid PDF, TXT, or DOC file.");
      }
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error("Failed to read file"));
        }
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleUpload = async () => {
    if ((!notes.trim() && !selectedFile) || !user) return;
    setLoading(true);
    try {
      let fileData;
      if (selectedFile) {
        const base64 = await fileToBase64(selectedFile);
        fileData = {
          data: base64,
          mimeType: selectedFile.type || 'application/pdf'
        };
      }

      const generated = await generateLearningMaterials({ text: notes, file: fileData });
      setResult(generated);
      
      // Save to Firebase
      await addDoc(collection(db, 'notes'), {
        userId: user.uid,
        content: notes || (selectedFile ? `File: ${selectedFile.name}` : ''),
        summary: generated.summary,
        flashcards: generated.flashcards,
        quiz: generated.quiz,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error processing notes:", error);
      alert("Failed to process notes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuizSubmit = async () => {
    if (!result || !user) return;
    let correct = 0;
    result.quiz.forEach((q, i) => {
      if (quizAnswers[i] === q.answer) correct++;
    });
    setScore(correct);
    setQuizSubmitted(true);

    const xpEarned = correct * 10;
    
    if (xpEarned > 0) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFC107', '#D35400', '#FDFBF7']
      });

      // Update user XP
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        xp: increment(xpEarned)
      });
      await refreshUserData();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight">The Learning Hub</h1>
        <p className="text-gray-400 mt-2">Upload your notes and let AI do the heavy lifting.</p>
      </div>

      {!result && !loading && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-bg-glass rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border-glass"
        >
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-12 transition-all duration-300 ${
              isDragging 
                ? 'border-gold bg-gold/10 scale-[1.02]' 
                : 'border-gold/30 bg-bg-glass hover:bg-gold/5'
            }`}
          >
            <UploadCloud className={`w-16 h-16 mb-4 transition-colors duration-300 ${isDragging ? 'text-gold animate-bounce' : 'text-gold/70'}`} />
            <h3 className="text-xl font-bold mb-2">
              {isDragging ? 'Drop your file here' : 'Paste your notes or upload a file'}
            </h3>
            <p className="text-sm text-gray-400 mb-6 text-center max-w-md">
              Copy and paste your lecture notes, textbook excerpts, or ideas. We'll generate a pro summary, flashcards, and a quiz.
            </p>
            
            {selectedFile ? (
              <div className="w-full max-w-2xl bg-bg-glass p-4 rounded-xl border border-gold/50 flex items-center justify-between shadow-sm mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gold/10 rounded-lg">
                    <FileIcon className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{selectedFile.name}</p>
                    <p className="text-xs text-gray-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedFile(null)}
                  className="p-2 hover:bg-red-50 text-red-500 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <textarea
                className="w-full max-w-2xl h-48 p-4 rounded-xl border border-border-glass focus:ring-2 focus:ring-gold focus:border-transparent resize-none bg-bg-glass shadow-inner mb-4"
                placeholder="Paste your notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            )}

            {!selectedFile && (
              <div className="relative w-full max-w-2xl">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-border-glass"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-2 bg-bg-glass text-sm text-gray-400">OR</span>
                </div>
              </div>
            )}

            {!selectedFile && (
              <div className="mt-4">
                <label className="cursor-pointer inline-flex items-center space-x-2 bg-bg-glass border border-border-glass px-6 py-2 rounded-full hover:bg-gold/5 hover:border-gold/30 transition-all shadow-sm">
                  <UploadCloud className="w-4 h-4 text-bronze" />
                  <span className="text-sm font-bold text-white">Upload File (PDF, TXT)</span>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".pdf,.txt,.doc,.docx"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!notes.trim() && !selectedFile}
              className="mt-8 bg-bg-secondary text-white px-8 py-3 rounded-full font-bold hover:bg-bg-secondary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              Generate Magic
            </button>
          </div>
        </motion.div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gold/20 rounded-full blur-xl animate-pulse"></div>
            <Loader2 className="w-16 h-16 text-gold animate-spin relative z-10" />
          </div>
          <h2 className="text-3xl font-black text-white mb-4 animate-pulse">Processing your notes...</h2>
          <div className="flex items-center space-x-2 text-gray-400">
            <Sparkles className="w-5 h-5 text-bronze animate-pulse" />
            <p>Extracting key concepts, building flashcards, and crafting a quiz.</p>
          </div>
          
          {/* Progress bar simulation */}
          <div className="w-64 h-2 bg-bg-glass rounded-full mt-8 overflow-hidden border border-border-glass">
            <motion.div 
              className="h-full bg-gradient-to-r from-gold to-bronze"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 15, ease: "linear" }}
            />
          </div>
        </div>
      )}

      {result && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-bg-glass rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border-glass overflow-hidden"
        >
          <div className="flex justify-between items-center border-b border-border-glass overflow-x-auto pr-4">
            <div className="flex">
              {[
                { id: 'summary', icon: FileText, label: 'Pro Summary' },
                { id: 'flashcards', icon: Layers, label: 'Flashcards' },
                { id: 'quiz', icon: Target, label: 'Knowledge Quiz' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
                    activeTab === tab.id 
                      ? 'text-bronze border-b-2 border-bronze bg-bronze/5' 
                      : 'text-gray-400 hover:text-white hover:bg-bg-glass'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full bg-bg-main hover:bg-gold/20 text-white font-bold transition-colors border border-border-glass"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
                
                <AnimatePresence>
                  {showShareMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-bg-glass rounded-2xl shadow-xl border border-border-glass overflow-hidden z-50"
                    >
                      <div className="p-2 space-y-1">
                        <button
                          onClick={() => shareToSocial('twitter', activeTab === 'quiz' && quizSubmitted ? 'quiz' : 'summary')}
                          className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-[#1DA1F2]/10 text-white transition-colors"
                        >
                          <Twitter className="w-4 h-4 text-[#1DA1F2]" />
                          <span className="text-sm font-semibold">Twitter / X</span>
                        </button>
                        <button
                          onClick={() => shareToSocial('linkedin', activeTab === 'quiz' && quizSubmitted ? 'quiz' : 'summary')}
                          className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-[#0A66C2]/10 text-white transition-colors"
                        >
                          <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                          <span className="text-sm font-semibold">LinkedIn</span>
                        </button>
                        <button
                          onClick={() => shareToSocial('facebook', activeTab === 'quiz' && quizSubmitted ? 'quiz' : 'summary')}
                          className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-[#1877F2]/10 text-white transition-colors"
                        >
                          <Facebook className="w-4 h-4 text-[#1877F2]" />
                          <span className="text-sm font-semibold">Facebook</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 min-h-[500px]">
            <AnimatePresence mode="wait">
              {activeTab === 'summary' && (
                <motion.div
                  key="summary"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="prose prose-invert max-w-none prose-headings:text-white prose-a:text-bronze"
                >
                  <ReactMarkdown>{result.summary}</ReactMarkdown>
                </motion.div>
              )}

              {activeTab === 'flashcards' && (
                <motion.div
                  key="flashcards"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col items-center justify-center h-full py-12"
                >
                  <div className="relative w-full max-w-2xl aspect-[3/2] perspective-1000">
                    <motion.div
                      className="w-full h-full relative preserve-3d cursor-pointer"
                      animate={{ rotateY: isFlipped ? 180 : 0 }}
                      transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                      onClick={() => setIsFlipped(!isFlipped)}
                    >
                      {/* Front */}
                      <div className="absolute inset-0 backface-hidden bg-bg-glass border-2 border-gold/30 rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 text-center">
                        <span className="absolute top-4 left-6 text-sm font-bold text-gold uppercase tracking-widest">Question</span>
                        <h3 className="text-2xl md:text-3xl font-bold text-white">{result.flashcards[flashcardIndex].front}</h3>
                        <p className="absolute bottom-4 text-sm text-gray-400">Click to flip</p>
                      </div>
                      
                      {/* Back */}
                      <div className="absolute inset-0 backface-hidden bg-gold border-2 border-gold rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 text-center [transform:rotateY(180deg)]">
                        <span className="absolute top-4 left-6 text-sm font-bold text-white uppercase tracking-widest">Answer</span>
                        <h3 className="text-xl md:text-2xl font-medium text-white">{result.flashcards[flashcardIndex].back}</h3>
                      </div>
                    </motion.div>
                  </div>

                  <div className="flex items-center space-x-6 mt-12">
                    <button
                      onClick={() => {
                        setIsFlipped(false);
                        setTimeout(() => setFlashcardIndex(prev => Math.max(0, prev - 1)), 150);
                      }}
                      disabled={flashcardIndex === 0}
                      className="px-6 py-2 rounded-full font-bold text-white bg-bg-main hover:bg-gold/20 disabled:opacity-50 transition-colors"
                    >
                      Previous
                    </button>
                    <span className="font-bold text-gray-400">
                      {flashcardIndex + 1} / {result.flashcards.length}
                    </span>
                    <button
                      onClick={() => {
                        setIsFlipped(false);
                        setTimeout(() => setFlashcardIndex(prev => Math.min(result.flashcards.length - 1, prev + 1)), 150);
                      }}
                      disabled={flashcardIndex === result.flashcards.length - 1}
                      className="px-6 py-2 rounded-full font-bold text-white bg-bg-secondary hover:bg-bg-secondary/90 disabled:opacity-50 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'quiz' && (
                <motion.div
                  key="quiz"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="max-w-3xl mx-auto"
                >
                  {quizSubmitted ? (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gold/20 mb-6">
                        <Trophy className="w-12 h-12 text-gold" />
                      </div>
                      <h2 className="text-4xl font-black mb-2">You scored {score}/{result.quiz.length}!</h2>
                      <p className="text-xl text-gray-400 mb-8">Earned <span className="font-bold text-bronze">+{score * 10} XP</span></p>
                      
                      <div className="space-y-6 text-left">
                        {result.quiz.map((q, i) => (
                          <div key={i} className={`p-6 rounded-2xl border ${quizAnswers[i] === q.answer ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                            <h4 className="font-bold text-lg mb-2">{i + 1}. {q.question}</h4>
                            <p className="text-sm mb-1">Your answer: <span className={quizAnswers[i] === q.answer ? 'text-green-700 font-semibold' : 'text-red-700 font-semibold'}>{quizAnswers[i] || 'Skipped'}</span></p>
                            {quizAnswers[i] !== q.answer && (
                              <p className="text-sm text-green-700 font-semibold">Correct answer: {q.answer}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-12">
                      {result.quiz.map((q, i) => (
                        <div key={i} className="bg-bg-glass p-6 rounded-2xl border border-border-glass">
                          <h4 className="text-xl font-bold mb-6 text-white">
                            <span className="text-gold mr-2">{i + 1}.</span>
                            {q.question}
                          </h4>
                          <div className="space-y-3">
                            {q.options.map((opt, j) => (
                              <label 
                                key={j} 
                                className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${
                                  quizAnswers[i] === opt 
                                    ? 'bg-gold/10 border-gold shadow-sm' 
                                    : 'bg-bg-glass border-border-glass hover:border-gold/50 hover:bg-bg-main'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`question-${i}`}
                                  value={opt}
                                  checked={quizAnswers[i] === opt}
                                  onChange={() => setQuizAnswers(prev => ({ ...prev, [i]: opt }))}
                                  className="w-5 h-5 text-gold focus:ring-gold border-border-glass"
                                />
                                <span className="ml-3 font-medium text-white">{opt}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                      
                      <div className="sticky bottom-4 flex justify-center mt-8">
                        <button
                          onClick={handleQuizSubmit}
                          disabled={Object.keys(quizAnswers).length !== result.quiz.length}
                          className="bg-gold text-gray-900 px-12 py-4 rounded-full font-black text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                        >
                          Submit Quiz & Earn XP
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Chatbot UI */}
      {result && (
        <>
          {/* Floating Action Button */}
          <button
            onClick={() => setIsChatOpen(true)}
            className={`fixed bottom-6 right-6 p-4 rounded-full bg-bronze text-white shadow-2xl hover:scale-110 transition-transform z-40 ${isChatOpen ? 'hidden' : 'flex'}`}
          >
            <MessageCircle className="w-6 h-6" />
          </button>

          {/* Chat Panel */}
          <AnimatePresence>
            {isChatOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] max-h-[80vh] bg-bg-glass rounded-3xl shadow-2xl border border-border-glass flex flex-col z-50 overflow-hidden"
              >
                {/* Chat Header */}
                <div className="bg-bronze p-4 flex justify-between items-center text-white">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5" />
                    <h3 className="font-bold">AI Tutor</h3>
                  </div>
                  <button onClick={() => setIsChatOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-bg-glass">
                  {chatMessages.length === 0 && (
                    <div className="text-center text-gray-400 mt-4">
                      <p className="text-sm">Ask me anything about your notes or the summary!</p>
                    </div>
                  )}
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-gold text-gray-900 rounded-br-sm' : 'bg-bg-glass border border-border-glass text-white rounded-bl-sm'}`}>
                        <div className="prose prose-sm max-w-none prose-p:leading-snug prose-p:my-0">
                          <ReactMarkdown>
                            {msg.parts[0].text}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isChatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-bg-glass border border-border-glass p-3 rounded-2xl rounded-bl-sm flex space-x-2 items-center">
                        <div className="w-2 h-2 bg-bronze/50 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-bronze/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <div className="w-2 h-2 bg-bronze/50 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <div className="p-4 bg-bg-glass border-t border-border-glass">
                  <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask a question..."
                      className="flex-1 bg-bg-glass border border-border-glass rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                      disabled={isChatLoading}
                    />
                    <button
                      type="submit"
                      disabled={!chatInput.trim() || isChatLoading}
                      className="p-2 rounded-full bg-gold text-gray-900 hover:bg-gold/80 transition-colors disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
