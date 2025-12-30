import { Poppins, Roboto } from "next/font/google";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/organisms/Navbar";
import AuthProvider from "@/provider/AuthProvider";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata = {
  title: "Nuy Commerce",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${roboto.variable} antialiased`}>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>

        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#232325",
              color: "#f2f8fc",
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: "#f2f8fc",
                secondary: "#232325",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
