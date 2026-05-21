export default function SchedulesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col  gap-4 px-5 py-8 md:py-10">
      <div className="inline-block  text-center justify-center">{children}</div>
    </section>
  );
}
