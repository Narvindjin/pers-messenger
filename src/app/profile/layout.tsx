'use client'
export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div>
          <div>profile layout</div>
          {children}
      </div>
  );
}