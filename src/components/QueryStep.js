'use client';
import { useState } from 'react';
import AdminStep from './AdminStep';

const SHEETDB_URL = 'https://sheetdb.io/api/v1/rzyq1bdriv1u0';
const SHEET_NAME = 'Registration';

export default function QueryStep({ onBack }) {
  const [activeTab, setActiveTab] = useState('user'); // 'user' | 'admin'

  // --- 隊員查詢狀態 ---
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [userOrders, setUserOrders] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState('');

  // 匯款後五碼輸入與更新狀態
  const [remitCode, setRemitCode] = useState('');
  const [isUpdatingRemit, setIsUpdatingRemit] = useState(false);

  // 隊員查詢報名紀錄
  const handleUserQuery = async (e) => {
    e.preventDefault();
    setUserLoading(true);
    setUserError('');
    setUserOrders(null);
    setSelectedOrder(null);

    try {
      const trimmedId = userId.trim().toUpperCase();
      const trimmedName = userName.trim();

      const response = await fetch(`${SHEETDB_URL}?sheet=${SHEET_NAME}`);
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        const idMatched = data.filter(order => {
          const val = order['身分證字號/護照號碼'];
          return val && val.toString().trim().toUpperCase() === trimmedId;
        });

        if (idMatched.length === 0) {
          setUserError('查無此身分證字號/護照號碼的報名紀錄。');
          return;
        }

        const matched = idMatched.filter(order => 
          order.中文姓名 && order.中文姓名.toString().trim() === trimmedName
        );

        if (matched.length > 0) {
          setUserOrders(matched);
        } else {
          setUserError('查有此證號，但與所輸入的中文姓名不相符，請確認後重試。');
        }
      } else {
        setUserError('資料庫回傳格式異常，請聯繫管理員。');
      }
    } catch (err) {
      console.error('Query Error:', err);
      setUserError(`查詢失敗 (${err.message})。若提示 401，請確認試算表權限。`);
    } finally {
      setUserLoading(false);
    }
  };

  // 點選進入單一活動詳情
  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    setRemitCode(order.匯款帳號後五碼 || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 隊員填寫並更新匯款後五碼
  const handleUpdateRemit = async () => {
    if (!remitCode || remitCode.trim().length !== 5) {
      alert('請填寫正確的銀行帳號末 5 碼！');
      return;
    }

    setIsUpdatingRemit(true);
    try {
      const response = await fetch(
        `${SHEETDB_URL}/報名編號/${encodeURIComponent(selectedOrder.報名編號)}?sheet=${SHEET_NAME}`,
        {
          method: 'PATCH',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            data: {
              匯款帳號後五碼: remitCode.trim(),
              報名狀態: '已回報待對帳'
            }
          })
        }
      );

      const res = await response.json();
      if (response.ok && res.updated === 1) {
        alert('匯款帳號後五碼已成功填寫！等待審查完成，會發送活動報名成功通知信件。');

        const updated = {
          ...selectedOrder,
          匯款帳號後五碼: remitCode.trim(),
          報名狀態: '已回報待對帳'
        };
        setSelectedOrder(updated);
        setUserOrders(prev => prev.map(o => o.報名編號 === updated.報名編號 ? updated : o));
      } else {
        alert(`資料更新失敗：${res.error || '請聯繫客服人員'}`);
      }
    } catch (err) {
      console.error(err);
      alert('網路連線失敗，請稍後再試。');
    } finally {
      setIsUpdatingRemit(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case '已確認':
      case '報名成功':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800 border border-green-200">✓ {status}</span>;
      case '已回報待對帳':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800 border border-blue-200">⏳ {status}</span>;
      case '待繳費':
      default:
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-200">⚠️ {status || '待繳費'}</span>;
    }
  };

  return (
    <div className="w-full text-left space-y-6">
      {/* 頂部切換與返回按鈕 */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex gap-2">
          <button
            onClick={() => {
              setActiveTab('user');
              setSelectedOrder(null);
            }}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
              activeTab === 'user' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            隊員報名查詢
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
              activeTab === 'admin' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            管理員登入
          </button>
        </div>
        <button
          onClick={onBack}
          className="text-sm text-gray-500 hover:text-green-600 underline"
        >
          ← 返回首頁
        </button>
      </div>

      {/* ================= 模式 1：隊員查詢 ================= */}
      {activeTab === 'user' && (
        <div className="space-y-6">
          {!selectedOrder ? (
            <>
              {/* 身分輸入表單 */}
              <form onSubmit={handleUserQuery} className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
                <h3 className="text-lg font-bold text-gray-800">登入系統查詢行程</h3>
                <p className="text-xs text-gray-500">請輸入報名時填寫的身分證字號/護照號碼與中文姓名。</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">身分證字號 / 護照號碼 *</label>
                    <input
                      type="text"
                      required
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      placeholder="如 A123456789"
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">中文姓名 *</label>
                    <input
                      type="text"
                      required
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="如 王小明"
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={userLoading}
                  className={`w-full py-3.5 font-bold text-white rounded-lg transition-colors ${
                    userLoading ? 'bg-gray-400 cursor-wait' : 'bg-green-600 hover:bg-green-700 shadow-sm'
                  }`}
                >
                  {userLoading ? '正在查詢報名紀錄...' : '查詢報名列表'}
                </button>
              </form>

              {userError && (
                <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-medium">
                  ⚠️ {userError}
                </div>
              )}

              {/* 報名列表 */}
              {userOrders && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="font-bold text-gray-800 text-lg">
                      報名行程清單 ({userOrders.length} 筆)
                    </h3>
                    <span className="text-xs text-gray-500">點選行程查看完整資訊與回報匯款</span>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {userOrders.map((order) => (
                      <div
                        key={order.報名編號}
                        onClick={() => handleSelectOrder(order)}
                        className="p-5 bg-white border-2 border-gray-200 hover:border-green-600 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-gray-400">{order.報名編號}</span>
                            <span className="text-xs text-gray-400">·</span>
                            <span className="text-xs text-gray-500">{order.報名時間}</span>
                          </div>
                          <h4 className="text-lg font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                            {order.行程名稱}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {order.出發梯次與團號}
                          </p>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0">
                          <div>
                            {getStatusBadge(order.報名狀態)}
                          </div>
                          <span className="text-sm font-bold text-green-600 group-hover:translate-x-1 transition-transform">
                            檢視詳情 →
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* ================= 點選進入：活動詳細報名資訊 (唯讀) ================= */
            <div className="space-y-6">
              <button
                onClick={() => setSelectedOrder(null)}
                className="inline-flex items-center gap-1 text-sm font-bold text-green-700 hover:underline"
              >
                ← 返回報名清單
              </button>

              <div className="bg-white border-2 border-green-600/30 p-5 md:p-6 rounded-xl space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                  <div>
                    <span className="text-xs text-gray-400 font-mono">報名編號：{selectedOrder.報名編號}</span>
                    <h3 className="text-2xl font-bold text-gray-900 mt-1">{selectedOrder.行程名稱}</h3>
                  </div>
                  <div>
                    {getStatusBadge(selectedOrder.報名狀態)}
                  </div>
                </div>

                <div className="text-sm text-gray-700">
                  <span className="font-bold">出發梯次與團號：</span>{selectedOrder.出發梯次與團號}
                </div>
              </div>

              {/* 唯讀報名資訊欄位 */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-5">
                <h4 className="font-bold text-gray-800 text-base border-b pb-2">報名詳細資訊 (唯讀)</h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 block text-xs">中文姓名</span>
                    <span className="font-bold text-gray-800">{selectedOrder.中文姓名}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs">國籍</span>
                    <span className="font-medium text-gray-800">{selectedOrder.國籍}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs">性別</span>
                    <span className="font-medium text-gray-800">{selectedOrder.性別}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs">出生年月日</span>
                    <span className="font-medium text-gray-800">{selectedOrder.出生年月日}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs">身分證字號/護照號碼</span>
                    <span className="font-mono font-medium text-gray-800">{selectedOrder['身分證字號/護照號碼']}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs">聯絡電話</span>
                    <span className="font-mono font-medium text-gray-800">{selectedOrder.聯絡電話}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm border-t pt-3">
                  <div>
                    <span className="text-gray-500 block text-xs">電子信箱</span>
                    <span className="font-medium text-gray-800">{selectedOrder.電子信箱}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs">通訊地址</span>
                    <span className="font-medium text-gray-800">{selectedOrder.通訊地址}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm border-t pt-3">
                  <div>
                    <span className="text-gray-500 block text-xs">緊急聯絡人姓名</span>
                    <span className="font-medium text-gray-800">{selectedOrder.緊急聯絡人姓名}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs">緊急聯絡人電話</span>
                    <span className="font-medium text-gray-800">{selectedOrder.緊急聯絡人電話}</span>
                  </div>
                </div>

                <div className="space-y-2 border-t pt-3 text-sm">
                  <div>
                    <span className="text-gray-500 block text-xs">近一年高海拔健行經歷</span>
                    <span className="font-medium text-gray-800">{selectedOrder.近一年高海拔健行經歷}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs">近三年登山經歷簡述</span>
                    <span className="font-medium text-gray-800">{selectedOrder.近三年登山經歷簡述 || '無'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-xs">特殊病史或身體狀況</span>
                    <span className="font-medium text-gray-800">{selectedOrder.特殊病史或身體狀況 || '無'}</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800 leading-relaxed">
                  ℹ️ 本頁面僅供資料檢視，不提供線上修改功能。<strong>需要修改請洽詢客服處理。</strong>
                </div>
              </div>

              {/* 唯一操作：填寫匯款帳號後五碼 */}
              <div className="bg-white p-6 rounded-xl border-2 border-green-600/40 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <h4 className="font-bold text-gray-900 text-base">
                    💳 訂金匯款回報
                  </h4>
                  {selectedOrder.匯款帳號後五碼 && (
                    <span className="text-xs bg-green-50 text-green-700 font-bold px-2.5 py-1 rounded border border-green-200">
                      目前紀錄後五碼：{selectedOrder.匯款帳號後五碼}
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-600">
                  完成預約訂金轉帳後，請於下方填寫您的銀行帳號末 5 碼，以便行政人員核對帳目。
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    maxLength={5}
                    value={remitCode}
                    onChange={(e) => setRemitCode(e.target.value)}
                    placeholder="請輸入匯款帳號後 5 碼"
                    className="flex-1 p-3 border border-gray-300 rounded-lg text-base font-mono bg-white"
                  />
                  <button
                    onClick={handleUpdateRemit}
                    disabled={isUpdatingRemit}
                    className="py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg whitespace-nowrap shadow-sm transition-colors"
                  >
                    {isUpdatingRemit ? '送出中...' : '完成匯款填寫「匯款帳號後五碼」'}
                  </button>
                </div>

                <div className="pt-2 text-xs text-gray-500 flex items-center gap-1.5">
                  <span>✉️</span>
                  <span>等待審查完成，會發送活動報名成功通知信件。</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= 模式 2：獨立管理員後台組件 ================= */}
      {activeTab === 'admin' && (
        <AdminStep />
      )}
    </div>
  );
}
