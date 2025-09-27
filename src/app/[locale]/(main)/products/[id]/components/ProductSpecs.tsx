"use client";

import { typSpecificationValues } from "@/content/types";

interface Props {
  specs: typSpecificationValues[];
}

export default function ProductSpecs({ specs }: Props) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Specifications</h2>
      <table className="w-full table-fixed border-collapse">
        <tbody>
          {specs.map((item, index) => (
            <tr
              key={item.id}
              className={index % 2 === 0 ? "bg-lightGray/20" : "bg-body"} // alternate colors
            >
              <td className="w-1/2 p-2 font-medium capitalize border-e border-body">
                {item.specificationType?.name}
              </td>
              <td className="w-1/2 p-2">{item.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
