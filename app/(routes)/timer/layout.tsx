import { TimerPageInitializer } from "@/components/Initializer";

export default function TimerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <TimerPageInitializer />
      {children}
    </>
  );
}
