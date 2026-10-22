'use client';
import { useState } from 'react';
import ConsentStep from '../components/ConsentStep';
import RegistrationForm from '../components/RegistrationForm';
import PaymentStep from '../components/PaymentStep';
import QueryStep from '../components/QueryStep';

export default function Home() {
  // 頁面主模式：'portal' (首頁選單) | 'register' (報名流程) | 'query' (報名查詢)
  const [viewMode, setViewMode] = useState('portal');

  // 報名流程步驟 (1: 同意書, 2: 填寫表單, 3: 完成與繳費指示)
  const [step, setStep] = useState(1);
  // 儲存報名成功後的訂單資料
  const [orderData, setOrderData] = useState(null);

  // 表單送出成功後觸發
  const handleFormComplete = (data) => {
    setOrderData(data);
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 重置回首頁入口
  const handleBackToPortal = () => {
    setViewMode('portal');
    setStep(1);
    setOrderData(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 flex flex-col items-center">
      {/* 網站頂部標頭 */}
      <div className="w-full max-w-3xl text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-wide">岳野登山社</h1>
        <p className="text-gray-600 mt-2 text-base md:text-lg">海外登山行程服務系統</p>
      </div>

      {/* 模式一：入口大廳 (首頁兩個按鈕) */}
      {viewMode === 'portal' && (
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10 text-center space-y-5">
          <p className="text-gray-600 font-medium pb-2">請選擇您要辦理的服務項目：</p>

          {/* 按鈕 1：進入報名系統 */}
          <button
            onClick={() => {
              setViewMode('register');
              setStep(1);
            }}
            className="w-full py-5 px-6 bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md transition-all duration-200 text-left flex items-center justify-between group"
          >
            <div>
              <div className="text-xl font-bold group-hover:translate-x-1 transition-transform">
                進入報名系統 →
              </div>
              <div className="text-sm text-green-100 mt-1">
                全新預約海外登山行程、閱讀同意條款
              </div>
            </div>
            <span className="text-3xl">🏔️</span>
          </button>

          {/* 按鈕 2：進入報名查詢 */}
          <button
            onClick={() => setViewMode('query')}
            className="w-full py-5 px-6 bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-200 hover:border-gray-400 rounded-xl transition-all duration-200 text-left flex items-center justify-between group"
          >
            <div>
              <div className="text-xl font-bold group-hover:translate-x-1 transition-transform text-gray-900">
                進入報名查詢 →
              </div>
              <div className="text-sm text-gray-500 mt-1">
                完成報名後查詢訂單進度、回報匯款後五碼
              </div>
            </div>
            <span className="text-3xl">🔍</span>
          </button>
        </div>
      )}

      {/* 模式二：報名系統流程 */}
      {viewMode === 'register' && (
        <div className="w-full max-w-3xl">
          <div className="mb-4 text-left">
            <button
              onClick={handleBackToPortal}
              className="text-sm text-gray-500 hover:text-green-600 font-medium"
            >
              ← 返回主選單
            </button>
          </div>

          <div className="mb-6 grid grid-cols-3 gap-2 text-center text-xs md:text-sm font-bold">
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

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
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
                onReset={handleBackToPortal}
              />
            )}
          </div>
        </div>
      )}

      {/* 模式三：報名查詢與管理後台 */}
      {viewMode === 'query' && (
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
          <QueryStep onBack={handleBackToPortal} />
        </div>
      )}
    </main>
  );
}
