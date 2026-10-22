'use client';
import { useState } from 'react';

export default function ConsentStep({ onAgree }) {
  const [agreePolicy, setAgreePolicy] = useState(false);
  const [agreeSafety, setAgreeSafety] = useState(false);

  // 必須兩者都勾選才算通過
  const isAllAgreed = agreePolicy && agreeSafety;

  return (
    <div className="w-full text-left">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">報名前確認事項</h2>

      {/* 條款一：報名同意聲明 (完整版) */}
      <div className="mb-6">
        <h3 className="font-bold text-lg mb-2 text-gray-800">一、報名同意聲明</h3>
        <div className="bg-gray-50 p-4 rounded-lg h-56 overflow-y-auto mb-3 text-sm text-gray-700 border border-gray-200 space-y-3">
          <p>1. 本人已詳細閱讀並同意本行程相關內容、報名須知、取消政策及各項規定。</p>
          <p>2. 本人了解本行程取消及退費標準依交通部觀光署公告之國外旅遊定型化契約及相關法令辦理；如有已代訂且無法退還之費用（如山屋、登山申請、保險、交通、嚮導及其他已支付款項等），本人同意負擔實際發生之費用。</p>
          <p>3. 本人確認自身健康狀況適合參加本次海外登山活動，如有慢性疾病、特殊病史或其他可能影響活動安全之情形，將主動告知主辦單位，並願自行承擔因個人健康因素所衍生之風險及責任。</p>
          <p>4. 本人同意岳野登山社公司於活動辦理、保險投保、機票訂位、住宿及山屋預訂、交通安排、緊急聯絡及相關旅遊服務範圍內，蒐集、處理及利用本人所提供之個人資料。</p>
          <p>5. 本人已確認所提供之資料均為真實且正確，如因資料錯誤、不完整或未據實告知而造成權益受損，願自行負責。</p>
          <p>6. 本人已年滿18歲，或已取得法定代理人同意報名參加本活動。</p>
        </div>
        <label className="flex items-start gap-3 p-2 cursor-pointer touch-manipulation">
          <input 
            type="checkbox" 
            className="mt-1 min-w-[24px] h-6 text-green-600 rounded border-gray-300"
            checked={agreePolicy}
            onChange={(e) => setAgreePolicy(e.target.checked)}
          />
          <span className="text-gray-800 font-bold">本人已閱讀並同意《取消政策暨健康聲明及個人資料授權書》</span>
        </label>
      </div>

      {/* 條款二：登山安全聲明書 (完整版) */}
      <div className="mb-8">
        <h3 className="font-bold text-lg mb-2 text-gray-800">二、登山安全聲明書</h3>
        <div className="bg-gray-50 p-4 rounded-lg h-56 overflow-y-auto mb-3 text-sm text-gray-700 border border-gray-200 space-y-3">
          <p>此聲明書之目的，旨在提高貴旅客對登山活動之認知及安心與安全。參加活動前請貴旅客必須同意聲明書內文；如貴旅客尚未成年，須同時請家長或監護人同意。</p>
          <p>1. 因出發前或旅遊期間，如遇天候不佳、颱風、地震、水災、森林火災、雪崩、封山、道路封鎖、疾病、罷工、班機延遲或取消、交通車故障或山屋關閉或不可抗力、不可歸責於本公司之事由，本公司保有變更行程權利。</p>
          <p>2. 若隊員個人無法於約定時間前到達集合點，導致無法參與行程，其損失由隊員個人承擔亦不得請求返還未參與的活動之費用。</p>
          <p>3. 登山活動屬中、高度體能消耗之休閒活動，參加本活動者，請檢視自我身心健康狀況，建議無患有醫生所禁止本運動之先天或後天疾病與症狀。如：心臟病、高血壓、癲癇、精神狀態不佳或情緒不穩定…等疾病者較不適宜參加。</p>
          <p>4. 登山應注意循序漸進，量力而行。活動期間需遵從領隊及嚮導安排與指示、引導，勿脫隊行動若隊員個人因素或是隊員不遵守領隊及嚮導安排與指示，導致迷路或是脫離隊伍的狀況，以至於需援助引導隊員歸隊所產生的相關費用，需由隊員個人自行負擔。</p>
          <p>5. 行程中若有身體不適，務請告知領隊及嚮導，切記勿逞強，以免發生意外。</p>
          <p>6. 從事登山活動期間，切記勿單獨行動，應結伴同行迷路時應折回原路，或尋找避難處靜待救援，以減少體力的消耗，並發出求救訊息。</p>
          <p>7. 從事登山活動期間，若發生身心狀態不適情況，應立即停止登山活動。</p>
          <p>8. 若發現自身或他人受傷，不任意移動，應立即通知領隊及嚮導人員或是當地政府機關或有關人員協助處理。</p>
          <p>9. 登山行進中請攜帶具有通訊功能之設備能於緊急情況時聯繫使用。</p>
          <p>10. 在山林中活動時，必須遵守LNT原則以及當地法規，若個人有違法行為，需自行負責。</p>
          <p>11. 旅遊期間如遇不可抗力、不可歸責於本公司之事由，致使無法完成行程，本公司有權變更行程、遊覽項目或更換食宿；變更後有節省支出費用之狀況，本公司將退回節省之費用；變更後有增加之支出費用，由隊員全體平均承擔該費用；若更改後行程而隊員不參與，則扣除已支付的各項代辦理，包含保險費、住宿費、交通費、行政服務費與食材費等支出費用後，退回剩餘費用。</p>
          <p>12. 為了隊員每個人的安全及團隊整體行程順利，領隊或嚮導有權利根據隊員個人身心狀況，決定登頂與否，若被決定不能攻頂的隊員必須依據領隊或嚮導指令在安全的地方或是山屋休息，等待其他隊員登頂後，一同歸隊下山。</p>
          <p>13. 因隊員個人因體力不支無法到達指定山屋或地點時而必須提前下山所產生之交通、食住、救援費用、運送、搬運以及人員服務等相關費用，需由隊員個人自行負擔。</p>
          <p>14. 充分瞭解投保之保險僅用來彌補隊員個人因登山活動身體傷害所造成直接部份損害，而不包含隊員個人財物及其他相關之間接損害、以及他人身體或財物之損害。</p>
          <p>15. 因個人疏忽、故意、或過失而產生的意外及損失、隊員個人需負起責任以及負擔所產生的救援、醫療、食宿交通、賠償、人員服務等相關費用。</p>
        </div>
        <label className="flex items-start gap-3 p-2 cursor-pointer touch-manipulation">
          <input 
            type="checkbox" 
            className="mt-1 min-w-[24px] h-6 text-green-600 rounded border-gray-300"
            checked={agreeSafety}
            onChange={(e) => setAgreeSafety(e.target.checked)}
          />
          <span className="text-gray-800 font-bold">本人已詳閱《登山安全聲明書》，充分了解海外登山活動之相關風險、安全規定、體能要求及注意事項，並同意遵守主辦單位、領隊及嚮導之安排與指示。</span>
        </label>
      </div>

      {/* 下一步按鈕 */}
      <button 
        onClick={onAgree}
        disabled={!isAllAgreed}
        className={`w-full py-4 text-lg font-bold rounded-lg transition-colors duration-200 ${
          isAllAgreed 
            ? 'bg-green-600 text-white hover:bg-green-700 shadow-md' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {isAllAgreed ? '同意上述條款，開始填寫報名資料' : '請先勾選同意上述條款'}
      </button>
    </div>
  );
}
