import "./globals.css";

export const metadata = {
  title: "AL HIDAYA DIGITAL SCHOOL",
  description:
    "Al Hidaya International School, Muthkur, Bengaluru — Preschool to Grade 7. One School. One Platform. Complete Transparency.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
