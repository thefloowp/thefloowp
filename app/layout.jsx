import "./globals.css";
import "./admin-styles.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: {
    default: "Floowp — Never Static",
    template: "%s | Floowp",
  },
  description:
    "Floowp is a collaborative marketing agency and creative studio built to move brands from launch to scalable growth.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
