import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { StaffInformationContextProvider } from "@/context/StaffInformationContext";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Lachin Shipping",
    description: "Lachin Shipping LLC",
    icons: {
        icon: "favicon.png",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <AuthProvider>
                    <StaffInformationContextProvider>
                        <main>{children}</main>
                    </StaffInformationContextProvider>
                </AuthProvider>
                <Toaster />
            </body>
        </html>
    );
}
