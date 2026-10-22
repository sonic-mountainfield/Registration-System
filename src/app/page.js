'use client';
import { useState } from 'react';
import ConsentStep from '../components/ConsentStep';
import RegistrationForm from '../components/RegistrationForm';
import PaymentStep from '../components/PaymentStep';

export default function Home() {
  // 控制流程關卡 (1: 同意書, 2: 填寫表單, 3: 完成與繳費指示)
  const [step, setStep] = useState(1);
  // 儲存報名成功後的訂單資料
  const [orderData, setOrderData] = useState(null);

  // 表單送出成功後觸發
  const handleFormComplete = (data) => {
    setOrderData(data);
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 重新開始報名
  const handleReset = () => {
    setOrderData(null);
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 flex flex-col items-center">
      {/* 頁面標頭 */}
      <div className="w-full max-w-3xl text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-wide">岳野登山社</h1>
        <p className="text-gray-600 mt-2 text-lg">海外登山行程報名系統</p>
      </div>

      {/* 步驟進度條 */}
      <div className="w-full max-w-3xl mb-6 grid grid-cols-3 gap-2 text-center text-xs md:text-sm font-bold">
        <div className={`py-2 rounded-lg transition-colors ${step >= 1 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
          1. 閱讀聲明
        </div>
        <div className={`py-2 rounded-lg transition-colors ${step >= 2 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
          2. 填寫資料
        </div>
        <div className={`py-2 rounded-lg transition-colors ${step === 3 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
          3. 完成報名
        </div>
      </div>

      {/* 主要內容卡片 */}
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
        {step === 1 && (
          <ConsentStep onAgree={() => {
            setStep(2);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }} />
        )}

        {step === 2 && (
          <RegistrationForm 
            onComplete={handleFormComplete}
            onBack={() => {
              setStep(1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {step === 3 && (
          <PaymentStep 
            orderData={orderData}
            onReset={handleReset}
          />
        )}
      </div>
    </main>
  );
}
