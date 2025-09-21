"use client";

import { FC, ReactNode } from "react";

type SectionHeaderProps = {
  title: string;
  linkText?: string;
  linkHref?: string;
  className?: string;
};

const SectionHeader: FC<SectionHeaderProps> = ({
  title,
  linkText,
  linkHref = "#",
  className = "",
}) => {
  return (
    <div
      className={`flex justify-between items-center mb-6 pb-2 border-b border-gray-200 ${className}`}
    >
      <h2 className="text-xl font-semibold inline-block">{title}</h2>
      {linkText && (
        <a href={linkHref} className="text-blue-600 hover:underline">
          {linkText}
        </a>
      )}
    </div>
  );
};

export default SectionHeader;
