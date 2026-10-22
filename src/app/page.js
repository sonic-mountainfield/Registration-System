'use client';
import { useState } from 'react';
import ConsentStep from '../components/ConsentStep';

export default function Home() {
  // 控制目前在第幾關 (1: 同意書, 2: 報名表單, 3: 繳費說明)
  const [step, setStep] = useState(1);

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 flex flex-col items-center">
      <div className="w-full max-w-3xl text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-wide">岳野登山社</h1>
        <p className="text-gray-600 mt-2 text-lg">海外登山行程報名系統</p>
      </div>

      {/* 依據 step 顯示對應的內容區塊 */}
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        {step === 1 && (
          <ConsentStep onAgree={() => setStep(2)} />
        )}

        {step === 2 && (
          <div className="text-center py-10 space-y-4">
            <div className="text-5xl">📋</div>
            <h2 className="text-2xl font-bold text-gray-800">第二關：填寫報名資料</h2>
            <p className="text-gray-500">（同意書已順利通過！接下來我們要在此處放置資料填寫表單）</p>
            <button 
              onClick={() => setStep(1)}
              className="text-sm text-green-600 hover:underline pt-4"
            >
              ← 返回重新查看同意聲明
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
