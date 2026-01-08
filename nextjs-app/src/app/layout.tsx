import type { Metadata } from 'next';
import './globals.css';
import { MacOSLayout } from '@/components/layout/MacOSLayout';

export const metadata: Metadata = {
  title: '健康数据可视化 - Personal Health Information System',
  description: '综合健康数据分析与趋势追踪',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('scrollRestoration' in history) {
                history.scrollRestoration = 'manual';
              }
            `,
          }}
        />
      </head>
      <body>
        <MacOSLayout>{children}</MacOSLayout>
      </body>
    </html>
  );
}
