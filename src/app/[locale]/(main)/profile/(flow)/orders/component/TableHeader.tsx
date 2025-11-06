export const TableHeader = () => (
  <thead className=" text-sm font-medium text-content">
    <tr>
      <th className="py-3 px-4 text-left rounded-l-lg">
        <span className="bg-lightGray rounded-lg px-3 py-1 inline-block">
          Order number
        </span>
      </th>
      <th className="py-3 px-4 text-center">
        <span className="bg-lightGray rounded-lg px-3 py-1 inline-block">
          Product
        </span>
      </th>
      <th className="py-3 px-4 text-center">
        <span className="bg-lightGray rounded-lg px-3 py-1 inline-block">
          Date
        </span>
      </th>
      <th className="py-3 px-4 text-center">
        <span className="bg-lightGray rounded-lg px-3 py-1 inline-block">
          Total payment
        </span>
      </th>
      <th className="py-3 px-4 text-center rounded-r-lg">
        <span className="bg-lightGray rounded-lg px-3 py-1 inline-block">
          Status
        </span>
      </th>
    </tr>
  </thead>
);
