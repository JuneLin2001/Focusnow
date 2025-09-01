import AnalyticsPageInitializer from "@/components/Initializer/AnalyticsPageInitializer";

export default function AnalyticsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AnalyticsPageInitializer />
      {children}
    </>
  );
}
