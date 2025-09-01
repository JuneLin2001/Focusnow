import TimerPageInitializer from "@/components/Initializer/TimerPageInitializer";

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
