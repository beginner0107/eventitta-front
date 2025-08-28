import Providers from './providers';
import './globals.css';

export const metadata = {
  title: '이벤트있다 - 지역 기반 소셜 플랫폼',
  description: '다양한 모임을 찾고 참여하여 새로운 사람들과 소통하고 경험을 나누세요',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
