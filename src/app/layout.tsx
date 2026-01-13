import type { Metadata } from "next";
import { Suspense } from "react";
import { Manrope } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/shared/config/store-provider";
import { QueryProvider } from "@/shared/config/query-provider";
import { NotificationProvider } from "@/shared/ui/notification-provider";
import { CartSidebar } from "@/widgets/cart-sidebar";
import { ContactBar } from "@/widgets/contact-bar";
import { NavigationBar } from "@/widgets/navigation-bar";
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
              <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 pt-5">
                  <header className="bg-white border-stroke rounded-lg overflow-hidden mb-5">
                    <ContactBar />
                    <Suspense fallback={
                      <div className="navigation-bar navigation-bar--loading h-16 bg-white border-b border-stroke">
                        <div className="container mx-auto px-4 py-3">
                          <div className="h-10 bg-gray-100 rounded animate-pulse" />
                        </div>
                      </div>
                    }>
                      <NavigationBar />
                    </Suspense>
                  </header>
                </div>
                {children}
                <CartSidebar />
              </div>
            </NotificationProvider>
          </QueryProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
