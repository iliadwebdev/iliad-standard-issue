'use client';

interface ClientComponentWrapperProps {
  children: React.ReactNode;
}

export default function ClientComponentWrapper({
  children,
}: ClientComponentWrapperProps) {
  return <>{children}</>;
}
