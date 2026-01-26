import { ReactNode } from "react";

export default function AdminConfiguratorLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Bare layout - no theme provider, no fonts, no global styles applied
  // The configurator manages everything itself
  return <>{children}</>;
}
