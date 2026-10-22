'use client';

export default function PaymentStep({ orderData, onReset }) {
  return (
    <div className="w-full text-center space-y-6">
      {/* 成功圖示與標題 */}
      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full text-3xl mb-2">
        ✓
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800">報名資料已成功送出！</h2>
      <p className="text-gray-600">
        感謝您的報名，請保存您的報名編號以便後續查詢與匯款回報。
      </p>

      {/* 報名摘要卡片 */}
      <div className="bg-gray-50 p-4 md:p-6 rounded-xl border border-gray-200 text-left space-y-3">
        <div className="flex justify-between items-center border-b pb-3">
          <span className="text-sm text-gray-500">報名編號</span>
          <span className="font-mono font-bold text-green-700 text-lg">{orderData?.orderId}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">參加行程</span>
          <span className="font-medium text-gray-800">{orderData?.行程名稱}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">梯次與團號</span>
          <span className="font-medium text-gray-800">{orderData?.出發梯次與團號}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">參加者姓名</span>
          <span className="font-medium text-gray-800">{orderData?.中文姓名}</span>
        </div>
      </div>

      {/* 匯款帳號資訊 */}
      <div className="bg-amber-50/60 border border-amber-200 p-5 rounded-xl text-left space-y-3">
        <h3 className="font-bold text-amber-900 text-lg flex items-center gap-2">
          💰 訂金繳交與匯款資訊
        </h3>
        <p className="text-sm text-amber-800">
          請於報名後 <span className="font-bold underline">3 日內</span> 完成預約訂金繳交（每人 <span className="font-bold">NT$ 10,000</span>），以正式保留名額。
        </p>

        <div className="bg-white p-4 rounded-lg border border-amber-200 font-mono text-sm space-y-1 text-gray-800">
          <div><span className="text-gray-500">戶名：</span>角落旅行社股份有限公司</div>
          <div><span className="text-gray-500">銀行：</span>永豐銀行 (807) 城中分行</div>
          <div><span className="text-gray-500">帳號：</span>121-018-0009588-8</div>
        </div>

        <p className="text-xs text-amber-700">
          💡 海外客戶若需其他支付管道，請直接聯繫岳野登山社官方客服專員。
        </p>
      </div>

      {/* 後續步驟指示 */}
      <div className="bg-blue-50/60 border border-blue-200 p-5 rounded-xl text-left space-y-2">
        <h3 className="font-bold text-blue-900 text-base">下一步：回報匯款資訊</h3>
        <p className="text-sm text-blue-800 leading-relaxed">
          完成轉帳後，請前往我們的 <span className="font-bold">「報名查詢系統」</span>，輸入您的身分證字號與中文姓名，填寫 <span className="font-bold">「匯款帳號後五碼」</span>。系統收到回報後將自動寄發對帳與報名完成確認信！
        </p>
      </div>

      {/* 返回首頁按鈕 */}
      <button
        onClick={onReset}
        className="w-full py-3 bg-gray-800 hover:bg-gray-900 text-white font-bold rounded-lg transition-colors"
      >
        返回報名系統首頁
      </button>
    </div>
  );
}
