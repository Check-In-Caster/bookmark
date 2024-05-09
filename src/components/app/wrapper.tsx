"use client";

const CastWrapper: React.FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children,
}) => {
  return (
    <a
      className="grid cursor-pointer grid-flow-row  grid-cols-[repeat(14,minmax(0,1fr))] border-b bg-opacity-20 px-4 py-5"
      target="_blank"
      href={href}
    >
      {children}
    </a>
  );
};

export default CastWrapper;
