import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RentNest — Find & List Rental Properties with Ease',
  description: 'A modern rental property marketplace for tenants, landlords and admins.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
