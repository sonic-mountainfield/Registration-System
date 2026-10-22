'use client';
import { useState } from 'react';

// 行程清單
const TRIP_OPTIONS = {
  '日本系列': [
    '富士山三日行程',
    '富士山五日行程',
    '槍岳表銀座縱走',
    '白馬三山縱走',
    '秋季立山三山',
    '上高地涸澤賞楓',
    '日本百名山系列_秋季安達太良&磐梯山',
    '熊野古道 (暫時未上架)'
  ],
  '馬來西亞': [
    '馬來西亞神山 (暫時未上架)'
  ],
  '中國系列': [
    '西藏聖母峰旅行',
    '南疆探索塔莎古道'
  ]
};

// 2027 各行程出發梯次對照表
const BATCH_OPTIONS = {
  '富士山三日行程': [
    '[S1] 7月8日(四) ~ 7月10日(六)',
    '[S2] 7月15日(四) ~ 7月17日(六)',
    '[S3] 7月22日(四) ~ 7月24日(六)',
    '[S4] 7月29日(四) ~ 7月31日(六)',
    '[S5] 8月2日(一) ~ 8月4日(三) - 河口湖湖上祭',
    '[S6] 8月5日(四) ~ 8月7日(六)',
    '[S7] 8月22日(日) ~ 8月24日(二)',
    '[S8] 8月26日(四) ~ 8月28日(六)',
    '[S9] 8月29日(日) ~ 8月31日(二)',
    '[S10] 9月2日(四) ~ 9月4日(六)'
  ],
  '富士山五日行程': [
    '[G1] 7月11日(日) ~ 7月15日(四)（河口湖版本）',
    '[G2] 7月25日(日) ~ 7月29日(四)（御殿場 Outlet 版本）',
    '[G3] 8月18日(三) ~ 8月22日(日)（河口湖版本）',
    '[G4] 9月1日(三) ~ 9月5日(日)（河口湖版本）'
  ],
  '槍岳表銀座縱走': [
    '[H1] 7月30日(五) ~ 8月4日(三)'
  ],
  '白馬三山縱走': [
    '[H2] 9月9日(四) ~ 9月14日(二)',
    '[H3] 9月14日(二) ~ 9月19日(日)'
  ],
  '秋季立山三山': [
    '[T1] 9月26日(日) ~ 9月30日(四)',
    '[T2] 10月1日(五) ~ 10月5日(二)',
    '[T3] 10月7日(四) ~ 10月11日(一)'
  ],
  '上高地涸澤賞楓': [
    '[H4] 10月1日(五) ~ 10月5日(二)'
  ],
  '日本百名山系列_秋季安達太良&磐梯山': [
    '[F1] 10月15日 ~ 10月19日'
  ],
  '熊野古道 (暫時未上架)': [
    '暫時未開放報名'
  ],
  '馬來西亞神山 (暫時未上架)': [
    '暫時未開放報名'
  ],
  '西藏聖母峰旅行': [
    '[TB] 6月4日(五) ~ 6月15日(二)'
  ],
  '南疆探索塔莎古道': [
    '[XS] 4月2日(五) ~ 4月11日(日)'
  ]
};

export default function RegistrationForm({ onComplete, onBack }) {
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
    LINE: '',
    通訊地址: '',
    緊急聯絡人姓名: '',
    緊急聯絡人電話: '',
    近一年高海拔健行經歷: '否',
    近三年登山經歷簡述: '',
    特殊病史或身體狀況: '無',
    // --- 新增客製化需求狀態 ---
    市區住宿需求: '單人報名，可以安排同性別住宿雙床房',
    溫泉住宿需求: '單人報名，請協助分配入住即可',
    山屋飲食需求: '葷食',
    溫泉飲食備註: '',
    裝備租借需求: '無需求'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 判斷是否顯示溫泉旅館選項
  const isHotSpringTrip = formData.行程名稱 === '富士山五日行程' || formData.行程名稱 === '秋季立山三山';

  // 選單連動切換
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === '行程區域') {
      const defaultTrip = TRIP_OPTIONS[value][0];
      const defaultBatch = BATCH_OPTIONS[defaultTrip] ? BATCH_OPTIONS[defaultTrip][0] : '';
      setFormData(prev => ({
        ...prev,
        行程區域: value,
        行程名稱: defaultTrip,
        出發梯次與團號: defaultBatch
      }));
    } else if (name === '行程名稱') {
      const defaultBatch = BATCH_OPTIONS[value] ? BATCH_OPTIONS[value][0] : '';
      setFormData(prev => ({
        ...prev,
        行程名稱: value,
        出發梯次與團號: defaultBatch
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // 送出報名資料至 SheetDB
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const now = new Date();
    const submitTime = now.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });
    const orderId = `YUEYE-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${Math.floor(Math.random() * 8999 + 1000)}`;

    const payload = {
      data: [
        {
          編號: "INCREMENT",
          報名時間: submitTime,
          報名編號: orderId,
          報名狀態: '待繳費',
          行程區域: formData.行程區域,
          行程名稱: formData.行程名稱,
          出發梯次與團號: formData.出發梯次與團號,
          中文姓名: formData.中文姓名,
          國籍: formData.國籍,
          性別: formData.性別,
          出生年月日: formData.出生年月日,
          '身分證字號/護照號碼': formData['身分證字號/護照號碼'],
          聯絡電話: formData.聯絡電話,
          電子信箱: formData.電子信箱,
          LINE: formData.LINE,
          通訊地址: formData.通訊地址,
          緊急聯絡人姓名: formData.緊急聯絡人姓名,
          緊急聯絡人電話: formData.緊急聯絡人電話,
          近一年高海拔健行經歷: formData.近一年高海拔健行經歷,
          近三年登山經歷簡述: formData.近三年登山經歷簡述 || '無',
          特殊病史或身體狀況: formData.特殊病史或身體狀況 || '無',
          同意條款紀錄: '已同意《取消政策暨健康聲明》及《登山安全聲明書》',
          匯款帳號後五碼: '',
          // --- 新增客製化需求欄位寫入 ---
          市區住宿需求: formData.市區住宿需求,
          溫泉住宿需求: isHotSpringTrip ? formData.溫泉住宿需求 : '無此行程',
          山屋飲食需求: formData.山屋飲食需求,
          溫泉飲食備註: isHotSpringTrip ? (formData.溫泉飲食備註 || '無') : '無此行程',
          裝備租借需求: formData.裝備租借需求
        }
      ]
    };

    try {
      const response = await fetch('https://sheetdb.io/api/v1/rzyq1bdriv1u0?sheet=Registration', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && (result.created === 1 || result.created)) {
        onComplete({ orderId, ...formData });
      } else {
        const errorDetail = result.error || JSON.stringify(result);
        alert(`報名送出失敗 (${response.status})：\n${errorDetail}`);
      }
    } catch (error) {
      console.error('Submit Error:', error);
      alert(`網路連線異常：${error.message}`);
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

      {/* --- 行程選擇 --- */}
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
          <select
            name="出發梯次與團號"
            value={formData.出發梯次與團號}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg bg-white"
          >
            {(BATCH_OPTIONS[formData.行程名稱] || []).map(batch => (
              <option key={batch} value={batch}>{batch}</option>
            ))}
          </select>
        </div>
      </div>

      {/* --- 個人基本資料 --- */}
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
              placeholder="海外身分請填護照號碼"
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">LINE 名稱 (LINE顯示的個人名稱或ID) *</label>
            <input
              type="text"
              name="LINE"
              required
              onChange={handleChange}
              placeholder="例如：王小明 或 mingsome123"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">通訊地址 *</label>
            <input
              type="text"
              name="通訊地址"
              required
              onChange={handleChange}
              placeholder="用於寄送行程物資或登頂證明"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* --- 客製化需求 --- */}
      <div className="space-y-4">
        <h3 className="font-bold text-gray-800 text-lg border-b pb-2">客製化需求</h3>
        
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">1. 住宿部分：東京或松本市區旅館 *</label>
          <p className="text-xs text-gray-500 mb-2">※ 山屋無法客製化需求</p>
          <select
            name="市區住宿需求"
            value={formData.市區住宿需求}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white"
          >
            <option value="單人報名，可以安排同性別住宿雙床房">單人報名，可以安排同性別住宿雙床房</option>
            <option value="單人報名，請安排單獨入住 (每晚NTD+2000)">單人報名，請安排單獨入住 (每晚NTD+2000)</option>
            <option value="雙人報名，請安排一大床房">雙人報名，請安排一大床房</option>
            <option value="雙人報名，請安排雙床房">雙人報名，請安排雙床房</option>
          </select>
        </div>

        {/* 只有特定行程才顯示溫泉區塊 */}
        {isHotSpringTrip && (
          <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">2. 溫泉旅館：河口湖溫泉或高山溫泉 *</label>
              <p className="text-xs text-gray-500 mb-2">※ 僅富士山5日或立山須選。一般安排3~4人入住和式房，客製需求請洽客服安排</p>
              <select
                name="溫泉住宿需求"
                value={formData.溫泉住宿需求}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white"
              >
                <option value="單人報名，請協助分配入住即可">單人報名，請協助分配入住即可</option>
                <option value="多人報名，請協助分配入住即可">多人報名，請協助分配入住即可</option>
                <option value="多人報名，請安排特定人數入住">多人報名，請安排特定人數入住</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">溫泉旅館餐食備註</label>
              <p className="text-xs text-gray-500 mb-2">※ 例如：不吃牛/生食/豬肉等等，無法客製化太細項請見諒</p>
              <input
                type="text"
                name="溫泉飲食備註"
                value={formData.溫泉飲食備註}
                onChange={handleChange}
                placeholder="若無特殊需求請留白"
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">3. 飲食需求：山屋供應 *</label>
          <p className="text-xs text-gray-500 mb-2">※ 山屋僅供應基礎素食或葷食，無法做額外客製化</p>
          <select
            name="山屋飲食需求"
            value={formData.山屋飲食需求}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white"
          >
            <option value="葷食">葷食</option>
            <option value="素食">素食</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">4. 登山裝備租借需求 *</label>
          <p className="text-xs text-gray-500 mb-2">※ 確定成團後會另外提供系統供詳細裝備登記</p>
          <select
            name="裝備租借需求"
            value={formData.裝備租借需求}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white"
          >
            <option value="無需求">無需求</option>
            <option value="有需求">有需求</option>
          </select>
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
            placeholder="如過敏、氣喘、心血管疾病等（若無請填無）"
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
