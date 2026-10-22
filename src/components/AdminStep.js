'use client';
import { useState } from 'react';

const SHEETDB_URL = 'https://sheetdb.io/api/v1/rzyq1bdriv1u0';
const SHEET_NAME = 'Registration';
const ADMIN_PASSWORD = '80648064';

export default function AdminStep() {
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [adminOrders, setAdminOrders] = useState([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [selectedTripFilter, setSelectedTripFilter] = useState('全部行程');

  // 管理員驗證
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (adminPasswordInput !== ADMIN_PASSWORD) {
      alert('管理密碼錯誤！');
      return;
    }
    setAdminAuthed(true);
    fetchAdminData();
  };

  // 載入全部報名名單
  const fetchAdminData = async () => {
    setAdminLoading(true);
    try {
      const response = await fetch(`${SHEETDB_URL}?sheet=${SHEET_NAME}`);
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setAdminOrders(data);
      }
    } catch (err) {
      console.error(err);
      alert(`無法載入後台資料：${err.message}`);
    } finally {
      setAdminLoading(false);
    }
  };

  // 修改報名狀態
  const handleAdminStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(
        `${SHEETDB_URL}/報名編號/${encodeURIComponent(orderId)}?sheet=${SHEET_NAME}`,
        {
          method: 'PATCH',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            data: { 報名狀態: newStatus }
          })
        }
      );

      const res = await response.json();
      if (response.ok && res.updated === 1) {
        setAdminOrders(prev => prev.map(o => o.報名編號 === orderId ? { ...o, 報名狀態: newStatus } : o));
      } else {
        alert('狀態修改失敗');
      }
    } catch (err) {
      console.error(err);
      alert('網路連線異常');
    }
  };

  // 動態行程選單
  const tripOptions = ['全部行程', ...Array.from(new Set(adminOrders.map(item => item.行程名稱).filter(Boolean)))];

  // 依行程過濾
  const filteredOrders = adminOrders.filter(item => {
    if (selectedTripFilter === '全部行程') return true;
    return item.行程名稱 === selectedTripFilter;
  });

  if (!adminAuthed) {
    return (
      <form onSubmit={handleAdminLogin} className="max-w-md mx-auto bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4 text-center">
        <div className="text-4xl">🔐</div>
        <h3 className="font-bold text-lg text-gray-800">岳野登山社 管理員驗證</h3>
        <p className="text-xs text-gray-500">請輸入後台管理通行密碼</p>

        <input
          type="password"
          required
          placeholder="請輸入管理密碼"
          value={adminPasswordInput}
          onChange={(e) => setAdminPasswordInput(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg text-center font-mono bg-white"
        />

        <button
          type="submit"
          className="w-full py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-lg"
        >
          解鎖並載入後台
        </button>
      </form>
    );
  }

  return (
    <div className="space-y-4">
      {/* 篩選與重新整理列 */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
        <div>
          <h3 className="font-bold text-xl text-gray-800">報名名單總覽</h3>
          <p className="text-xs text-gray-500">
            目前篩選行程共 <span className="font-bold text-green-700">{filteredOrders.length}</span> / {adminOrders.length} 筆資料
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-gray-600">行程篩選：</label>
            <select
              value={selectedTripFilter}
              onChange={(e) => setSelectedTripFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg text-sm bg-white font-medium text-gray-800 shadow-sm"
            >
              {tripOptions.map((trip) => {
                const count = trip === '全部行程' 
                  ? adminOrders.length 
                  : adminOrders.filter(o => o.行程名稱 === trip).length;
                return (
                  <option key={trip} value={trip}>
                    {trip} ({count}人)
                  </option>
                );
              })}
            </select>
          </div>

          <button
            onClick={fetchAdminData}
            className="px-3 py-2 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium transition-colors"
          >
            🔄 重新整理
          </button>
        </div>
      </div>

      {/* 資料表格 */}
      {adminLoading ? (
        <div className="text-center py-12 text-gray-400">名單載入中...</div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-xl">
          <table className="w-full text-left text-xs bg-white">
            <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
              <tr>
                <th className="p-3">編號 / 時間</th>
                <th className="p-3">姓名 / 證號</th>
                <th className="p-3">行程與梯次</th>
                <th className="p-3">聯絡電話</th>
                <th className="p-3">後五碼</th>
                <th className="p-3">狀態操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order, idx) => (
                <tr key={order.報名編號 || idx} className="hover:bg-gray-50">
                  <td className="p-3 font-mono">
                    <div className="font-bold text-gray-800">{order.報名編號}</div>
                    <div className="text-[10px] text-gray-400">{order.報名時間}</div>
                  </td>
                  <td className="p-3">
                    <div className="font-bold text-gray-900">{order.中文姓名} ({order.性別})</div>
                    <div className="text-gray-400 font-mono text-[11px]">{order['身分證字號/護照號碼']}</div>
                  </td>
                  <td className="p-3">
                    <div className="font-medium text-gray-800">{order.行程名稱}</div>
                    <div className="text-gray-500 text-[11px]">{order.出發梯次與團號}</div>
                  </td>
                  <td className="p-3 font-mono">{order.聯絡電話}</td>
                  <td className="p-3 font-mono font-bold text-green-700">
                    {order.匯款帳號後五碼 || <span className="text-gray-300 font-normal">無</span>}
                  </td>
                  <td className="p-3">
                    <select
                      value={order.報名狀態 || '待繳費'}
                      onChange={(e) => handleAdminStatusChange(order.報名編號, e.target.value)}
                      className="p-1 border border-gray-300 rounded font-medium text-xs bg-white"
                    >
                      <option value="待繳費">待繳費</option>
                      <option value="已回報待對帳">已回報待對帳</option>
                      <option value="已確認">已確認 (成功)</option>
                      <option value="已取消">已取消</option>
                    </select>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">
                    此行程尚無任何報名資料
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
