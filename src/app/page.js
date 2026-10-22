export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-3xl text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-wide">岳野登山社</h1>
        <p className="text-gray-600 mt-3 text-lg">海外登山行程報名系統</p>
        
        {/* 這裡先放一個佔位區塊，稍後我們會把「同意書」放進來 */}
        <div className="mt-10 p-8 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-400">報名系統載入中...</p>
        </div>
      </div>
    </main>
  );
}
