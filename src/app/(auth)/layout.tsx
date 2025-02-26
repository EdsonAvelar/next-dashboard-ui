import "../globals.css";

// app/(auth)/layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <title>Autenticação</title>
      </head>
      <body className="bg-gray-100">{children}</body>
    </html>
  );
}
