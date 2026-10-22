import './globals.css'

export const metadata = {
  title: '岳野登山社 - 報名系統',
  description: '海外登山行程專屬報名系統',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-TW">
      <body className="bg-gray-100 text-gray-900">
        {children}
      </body>
    </html>
  )
}
