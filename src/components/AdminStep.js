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

  // 信件預覽視窗狀態
  const [emailModalOrder, setEmailModalOrder] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

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

  // 載入全部名單
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

  // 行程下拉篩選項目
  const tripOptions = ['全部行程', ...Array.from(new Set(adminOrders.map(item => item.行程名稱).filter(Boolean)))];

  const filteredOrders = adminOrders.filter(item => {
    if (selectedTripFilter === '全部行程') return true;
    return item.行程名稱 === selectedTripFilter;
  });

  // 生成確認信主旨與內文
  const getEmailContent = (order) => {
    const subject = `【岳野登山社】活動報名成功暨行前確認通知 - ${order.行程名稱}`;
    const body = `親愛的 ${order.中文姓名} 隊員您好：

感謝您報名參加岳野登山社海外高山健行行程！
我們已完成您的訂金對帳與身分審查，正式確認保留您的活動席位。

【正式報名資訊】
--------------------------------------------------
・報名編號：${order.報名編號}
・參加隊員：${order.中文姓名} (${order.性別})
・預定行程：${order.行程名稱}
・出發梯次與團號：${order.出發梯次與團號}
・目前狀態：已審查確認完成 (報名成功)
--------------------------------------------------

【重要行前提醒事項】
1. 護照檢查：請確認您的護照效期自出發當日起具備 6 個月以上之有效期限。
2. 行前說明會：預計將於活動出發前 30～45 天以線上會議舉行，屆時將提前以 Email 與簡訊發送會議連結。
3. 體能鍛鍊與裝備：建議於出發前保持規律有氧運動習慣；專屬海外登山裝備檢核清單將於說明會前寄達您的信箱。

若有任何疑問或需變更聯絡資訊，請隨時回覆此信件，或加入岳野官方客服向專員洽詢。

岳野登山社 敬上
走向世界之巔 · 安全探索群山`;

    return { subject, body };
  };

  // 透過郵件軟體發送
  const handleSendMail = (order) => {
    const { subject, body } = getEmailContent(order);
    const mailtoUrl = `mailto:${order.電子信箱}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');
  };

  // 複製信件全文
  const handleCopyMailText = (order) => {
    const { subject, body } = getEmailContent(order);
    const fullText = `收件人：${order.電子信箱}\n信件主旨：${subject}\n\n${body}`;
    navigator.clipboard.writeText(fullText);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

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
    <div className="space-y-4 relative">
      {/* 篩選與工具列 */}
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
                <th className="p-3">聯絡電話 / Email</th>
                <th className="p-3">後五碼</th>
                <th className="p-3">狀態審查</th>
                <th className="p-3 text-center">通知操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order, idx) => {
                const isConfirmed = order.報名狀態 === '已確認';
                return (
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
                    <td className="p-3 font-mono">
                      <div>{order.聯絡電話}</div>
                      <div className="text-gray-400 text-[11px] font-sans">{order.電子信箱}</div>
                    </td>
                    <td className="p-3 font-mono font-bold text-green-700">
                      {order.匯款帳號後五碼 || <span className="text-gray-300 font-normal">無</span>}
                    </td>
                    <td className="p-3">
                      <select
                        value={order.報名狀態 || '待繳費'}
                        onChange={(e) => handleAdminStatusChange(order.報名編號, e.target.value)}
                        className={`p-1.5 border rounded font-medium text-xs bg-white ${
                          isConfirmed ? 'border-green-500 text-green-800 bg-green-50 font-bold' : 'border-gray-300'
                        }`}
                      >
                        <option value="待繳費">待繳費</option>
                        <option value="已回報待對帳">已回報待對帳</option>
                        <option value="已確認">已確認 (成功)</option>
                        <option value="已取消">已取消</option>
                      </select>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => setEmailModalOrder(order)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                          isConfirmed
                            ? 'bg-green-600 hover:bg-green-700 text-white animate-pulse'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                        }`}
                        title="開啟活動確認信範本"
                      >
                        ✉️ 發送確認信
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-400">
                    此行程尚無任何報名資料
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* --- 活動確認信預覽與發送視窗 (Modal) --- */}
      {emailModalOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">✉️</span>
                <h4 className="text-lg font-bold text-gray-800">
                  發送活動報名成功確認信
                </h4>
              </div>
              <button
                onClick={() => setEmailModalOrder(null)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs md:text-sm">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-1">
                <div>
                  <span className="text-gray-500 font-bold">收件隊員：</span>
                  <span className="font-bold text-gray-800">{emailModalOrder.中文姓名}</span> ({emailModalOrder.電子信箱})
                </div>
                <div>
                  <span className="text-gray-500 font-bold">活動行程：</span>
                  <span className="text-gray-800">{emailModalOrder.行程名稱} - {emailModalOrder.出發梯次與團號}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-bold">目前審核：</span>
                  <span className="font-bold text-green-700">{emailModalOrder.報名狀態}</span>
                </div>
              </div>

              <div>
                <label className="block text-gray-600 font-bold mb-1">信件預覽內容：</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono text-gray-700 whitespace-pre-line leading-relaxed max-h-64 overflow-y-auto">
                  {getEmailContent(emailModalOrder).body}
                </div>
              </div>
            </div>

            {/* 操作按鈕 */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t">
              <button
                onClick={() => handleSendMail(emailModalOrder)}
                className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-sm flex items-center justify-center gap-1.5 shadow-sm transition-colors"
              >
                <span>🚀</span>
                <span>開啟郵件軟體直接寄出</span>
              </button>
              <button
                onClick={() => handleCopyMailText(emailModalOrder)}
                className="py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-sm transition-colors"
              >
                {copySuccess ? '✓ 已複製內容！' : '📋 複製信件文字'}
              </button>
              <button
                onClick={() => setEmailModalOrder(null)}
                className="py-2.5 px-4 border border-gray-300 hover:bg-gray-50 text-gray-600 font-bold rounded-lg text-sm"
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
