import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AstroSoul - 找到你的灵魂伴侣，发现真爱命运 💕',
  description: '用古老的印度占星智慧 × 现代AI的温暖解读，为你匹配完美的灵魂伴侣',
  keywords: '灵魂伴侣, 爱情匹配, 占星配对, 真爱预测, 印度占星, 婚姻分析, 爱情占星',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="custom-scrollbar">
        {children}
      </body>
    </html>
  );
}


