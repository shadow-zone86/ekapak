import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/shared/config/store-provider";
import { QueryProvider } from "@/shared/config/query-provider";
import { NotificationProvider } from "@/shared/ui/notification-provider";
import { CartSidebar } from "@/widgets/cart-sidebar";
import { registerAllDependencies } from "./providers/di";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700"], // Regular and Bold
  display: "swap",
});

export const metadata: Metadata = {
  title: "EKAPAK - Интернет-магазин гибкой пластиковой упаковки",
  description: "EKAPAK - производство гибкой пластиковой упаковки по индивидуальным размерам и в минимальные сроки. Широкий ассортимент упаковочных решений для вашего бизнеса.",
  keywords: "EKAPAK, пластиковая упаковка, гибкая упаковка, производство упаковки, индивидуальная упаковка, интернет-магазин упаковки",
  openGraph: {
    title: "EKAPAK - Интернет-магазин гибкой пластиковой упаковки",
    description: "Производство гибкой пластиковой упаковки по индивидуальным размерам и в минимальные сроки",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Регистрируем все зависимости через DI контейнер
  registerAllDependencies();

  return (
    <html lang="ru">
      <body
        className={`${manrope.variable} antialiased`}
      >
        <StoreProvider>
          <QueryProvider>
            <NotificationProvider>
            {children}
            <CartSidebar />
            </NotificationProvider>
          </QueryProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
