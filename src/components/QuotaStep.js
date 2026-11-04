'use client';
import { useState, useEffect } from 'react';

const SHEETDB_URL = 'https://sheetdb.io/api/v1/rzyq1bdriv1u0';
const SHEET_NAME = 'Registration';

// 各行程滿團人數上限設定
const TRIP_CAPACITY = {
  '富士山三日行程': 25,
  '富士山五日行程': 25,
  '槍岳表銀座縱走': 15,
  '白馬三山縱走': 15,
  '秋季立山三山': 20,
  '上高地涸澤賞楓': 14,
  '日本百名山系列_秋季安達太良&磐梯山': 14,
  '西藏聖母峰旅行': 16,
  '南疆探索塔莎古道': 16
};

// 2027 各行程出發梯次對照表 (用來列出所有開團梯次)
const BATCH_OPTIONS = {
  '富士山三日行程': [
    '[S1] 7月8日(四) ~ 7月10日(六)', '[S2] 7月15日(四) ~ 7月17日(六)', '[S3] 7月22日(四) ~ 7月24日(六)',
    '[S4] 7月29日(四) ~ 7月31日(六)', '[S5] 8月2日(一) ~ 8月4日(三) - 河口湖湖上祭', '[S6] 8月5日(四) ~ 8月7日(六)',
    '[S7] 8月22日(日) ~ 8月24日(二)', '[S8] 8月26日(四) ~ 8月28日(六)', '[S9] 8月29日(日) ~ 8月31日(二)',
    '[S10] 9月2日(四) ~ 9月4日(六)'
  ],
  '富士山五日行程': [
    '[G1] 7月11日(日) ~ 7月15日(四)（河口湖版本）', '[G2] 7月25日(日) ~ 7月29日(四)（御殿場 Outlet 版本）',
    '[G3] 8月18日(三) ~ 8月22日(日)（河口湖版本）', '[G4] 9月1日(三) ~ 9月5日(日)（河口湖版本）'
  ],
  '槍岳表銀座縱走': ['[H1] 7月30日(五) ~ 8月4日(三)'],
  '白馬三山縱走': ['[H2] 9月9日(四) ~ 9月14日(二)', '[H3] 9月14日(二) ~ 9月19日(日)'],
  '秋季立山三山': ['[T1] 9月26日(日) ~ 9月30日(四)', '[T2] 10月1日(五) ~ 10月5日(二)', '[T3] 10月7日(四) ~ 10月11日(一)'],
  '上高地涸澤賞楓': ['[H4] 10月1日(五) ~ 10月5日(二)'],
  '日本百名山系列_秋季安達太良&磐梯山': ['[F1] 10月15日 ~ 10月19日'],
  '西藏聖母峰旅行': ['[TB] 6月4日(五) ~ 6月15日(二)'],
  '南疆探索塔莎古道': ['[XS] 4月2日(五) ~ 4月11日(日)']
};

export default function QuotaStep({ onBack }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quotaData, setQuotaData] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      let response = await fetch(`${SHEETDB_URL}?sheet=${SHEET_NAME}`);
      if (response.status === 404) response = await fetch(SHEETDB_URL);
      
      if (!response.ok) throw new Error(`連線錯誤 (${response.status})`);
      
      const rawData = await response.json();
      
      // 計算每個梯次的報名人數
      const counts = {};
      if (Array.isArray(rawData)) {
        rawData.forEach(order => {
          if (order.報名狀態 === '已取消') return;
          
          const trip = order.行程名稱;
          const batch = order.出發梯次與團號;
          if (!trip || !batch) return;
          
          if (!counts[trip]) counts[trip] = {};
          if (!counts[trip][batch]) counts[trip][batch] = { confirmed: 0, pending: 0 };
          
          if (order.報名狀態 === '待繳費') {
            counts[trip][batch].pending += 1;
          } else {
            counts[trip][batch].confirmed += 1;
          }
        });
      }
      setQuotaData(counts);
    } catch (err) {
      console.error(err);
      setError('無法取得最新名額資料，請稍後再試。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full text-left space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">📊 報名活動剩餘名額查詢</h2>
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-orange-600 underline">
          ← 返回首頁
        </button>
      </div>

      <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-sm text-orange-800 leading-relaxed">
        <strong>說明：</strong>可販售名額 = 總名額 - 已確認報名 - 待確認人數。<br/>
        (註：「待確認」代表已填單但尚未完成訂金支付手續，若逾期未繳將會釋出名額)
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-500 font-bold animate-pulse">
          🔄 正在同步最新報名數據...
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-medium">
          ⚠️ {error}
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(BATCH_OPTIONS).map(([tripName, batches]) => {
            const capacity = TRIP_CAPACITY[tripName];
            if (!capacity) return null; // 排除未上架行程

            return (
              <div key={tripName} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-800 px-5 py-3 flex items-center justify-between">
                  <h3 className="text-white font-bold text-lg">{tripName}</h3>
                  <span className="text-xs bg-gray-700 text-gray-300 px-2.5 py-1 rounded-md border border-gray-600">
                    上限 {capacity} 人/團
                  </span>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {batches.map(batch => {
                    const stats = quotaData[tripName]?.[batch] || { confirmed: 0, pending: 0 };
                    const available = Math.max(0, capacity - stats.confirmed - stats.pending);
                    
                    return (
                      <div key={batch} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-gray-50 transition-colors">
                        <div className="font-medium text-gray-700 text-sm md:text-base">
                          {batch}
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <div className="flex flex-col items-end">
                            <span className="text-gray-500 text-xs">已佔位 / 待確認</span>
                            <span className="font-mono text-gray-700">
                              {stats.confirmed} <span className="text-gray-300">/</span> <span className="text-orange-500">{stats.pending}</span>
                            </span>
                          </div>
                          <div className={`px-4 py-2 rounded-lg font-bold border min-w-[100px] text-center ${
                            available > 5 ? 'bg-green-50 text-green-700 border-green-200' :
                            available > 0 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-red-50 text-red-700 border-red-200'
                          }`}>
                            剩餘 {available}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
