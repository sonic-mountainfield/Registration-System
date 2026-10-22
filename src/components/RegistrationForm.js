'use client';
import { useState } from 'react';

// 行程與梯次資料庫 (與報名表單連動)
const TRIP_OPTIONS = {
  '日本系列': [
    '富士山三日行程',
    '富士山雙路線四日行程',
    '表銀座縱走五日行程',
    '劍岳立山四日行程',
    '槍岳縱走五日行程',
    '南阿爾卑斯北岳三日行程',
    '屋久島宮之浦岳四日行程'
  ],
  '馬來西亞': [
    '神山 (Kinabalu) 四日行程'
  ],
  '熊野古道': [
    '中邊路貫通六日行程 (未開放)'
  ],
  '中國系列': [
    '四姑娘山大峰五日行程',
    '亞丁三神山六日行程'
  ]
};

export default function RegistrationForm({ onComplete, onBack }) {
  // 1. 表單欄位狀態 (完全對應 Google Sheet A1~V1 欄位)
  const [formData, setFormData] = useState({
    行程區域: '日本系列',
    行程名稱: '富士山三日行程',
    出發梯次與團號: '[S1] 7月8日(四) ~ 7月10日(六)',
    中文姓名: '',
    國籍: '台灣',
    性別: '男',
    出生年月日: '',
    '身分證字號/護照號碼': '',
    聯絡電話: '',
    電子信箱: '',
    通訊地址: '',
    緊急聯絡人姓名: '',
    緊急聯絡人電話: '',
    近一年高海拔健行經歷: '否',
    近三年登山經歷簡述: '',
    特殊病史或身體狀況: '無'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. 欄位變更處理
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // 如果切換行程區域，自動將行程名稱重置為該區域的第一個選項
    if (name === '行程區域') {
      const defaultTrip = TRIP_OPTIONS[value][0];
      setFormData(prev => ({
        ...prev,
        行程區域: value,
        行程名稱: defaultTrip
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // 3. 送出表單到 SheetDB
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const now = new Date();
    const submitTime = now.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });
    const orderId = `YUEYE-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${Math.floor(Math.random() * 8999 + 1000)}`;

    // 組成給 SheetDB 的 Payload (Key 完全匹配 Google Sheet 表頭)
    const payload = {
      data: [
        {
          編號: "INCREMENT",
          報名時間: submitTime,
          報名編號: orderId,
          報名狀態: '待繳費',
          ...formData,
          同意條款紀錄: '已同意《取消政策暨健康聲明》及《登山安全聲明書》',
          匯款帳號後五碼: ''
        }
      ]
    };

    try {
      const response = await fetch('https://sheetdb.io/api/v1/rzyq1bdriv1u0', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.created === 1) {
        onComplete({ orderId, ...formData });
      } else {
        alert('報名資料送出失敗，請再試一次或聯繫客服。');
      }
    } catch (error) {
      console.error('Submit Error:', error);
      alert('網路連線異常，請稍後再試。');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full text-left space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">二、填寫報名資料</h2>
        <button type="button" onClick={onBack} className="text-sm text-gray-500 hover:text-green-600 underline">
          ← 重看聲明
        </button>
      </div>

      {/* --- 行程選擇區 --- */}
      <div className="bg-green-50/50 p-4 rounded-xl border border-green-100 space-y-4">
        <h3 className="font-bold text-green-900 text-lg">選擇報名行程</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">行程區域 *</label>
            <select
              name="行程區域"
              value={formData.行程區域}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white"
            >
              {Object.keys(TRIP_OPTIONS).map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">行程名稱 *</label>
            <select
              name="行程名稱"
              value={formData.行程名稱}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white"
            >
              {TRIP_OPTIONS[formData.行程區域].map(trip => (
                <option key={trip} value={trip}>{trip}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">出發梯次與團號 *</label>
          <input
            type="text"
            name="出發梯次與團號"
            value={formData.出發梯次與團號}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg bg-white"
            placeholder="請填寫梯次代碼，如 [S1] 7/8~7/10"
          />
        </div>
      </div>

      {/* --- 基本個人資料區 --- */}
      <div className="space-y-4">
        <h3 className="font-bold text-gray-800 text-lg border-b pb-2">個人基本資料</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">中文姓名 *</label>
            <input
              type="text"
              name="中文姓名"
              required
              onChange={handleChange}
              placeholder="請填寫同護照姓名"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">國籍 *</label>
            <select
              name="國籍"
              value={formData.國籍}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white"
            >
              <option value="台灣">台灣</option>
              <option value="香港">香港</option>
              <option value="新加坡">新加坡</option>
              <option value="其他">其他</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">性別 *</label>
            <select
              name="性別"
              value={formData.性別}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white"
            >
              <option value="男">男</option>
              <option value="女">女</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">出生年月日 *</label>
            <input
              type="date"
              name="出生年月日"
              required
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">身分證字號/護照號碼 *</label>
            <input
              type="text"
              name="身分證字號/護照號碼"
              required
              onChange={handleChange}
              placeholder="海外身份請填護照號碼"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">聯絡電話 (手機) *</label>
            <input
              type="tel"
              name="聯絡電話"
              required
              onChange={handleChange}
              placeholder="0912345678"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">電子信箱 (Email) *</label>
            <input
              type="email"
              name="電子信箱"
              required
              onChange={handleChange}
              placeholder="example@gmail.com"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">通訊地址 *</label>
          <input
            type="text"
            name="通訊地址"
            required
            onChange={handleChange}
            placeholder="用於寄送攻頂紀念證書"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      {/* --- 緊急聯絡人與經歷 --- */}
      <div className="space-y-4">
        <h3 className="font-bold text-gray-800 text-lg border-b pb-2">緊急聯絡人與登山經歷</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">緊急聯絡人姓名 *</label>
            <input
              type="text"
              name="緊急聯絡人姓名"
              required
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">緊急聯絡人電話 *</label>
            <input
              type="tel"
              name="緊急聯絡人電話"
              required
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">近一年高海拔 (3000m+) 健行經歷 *</label>
          <select
            name="近一年高海拔健行經歷"
            value={formData.近一年高海拔健行經歷}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white"
          >
            <option value="否">否</option>
            <option value="是">是</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">近三年登山經歷簡述</label>
          <textarea
            name="近三年登山經歷簡述"
            rows="2"
            onChange={handleChange}
            placeholder="例如：玉山主峰、雪山主東峰、嘉明湖..."
            className="w-full p-3 border border-gray-300 rounded-lg"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">特殊病史或身體狀況</label>
          <input
            type="text"
            name="特殊病史或身體狀況"
            onChange={handleChange}
            placeholder="如過敏、心血管狀況、氣喘等（若無請填無）"
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      {/* --- 送出按鈕 --- */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-4 text-lg font-bold rounded-lg text-white transition-colors duration-200 ${
          isSubmitting ? 'bg-gray-400 cursor-wait' : 'bg-green-600 hover:bg-green-700 shadow-md'
        }`}
      >
        {isSubmitting ? '資料傳送中，請稍候...' : '確認無誤，送出報名資料'}
      </button>
    </form>
  );
}
