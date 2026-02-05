
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="max-w-4xl mx-auto px-6">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}

