export const TableHeader = () => (
  <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 rounded-t-lg text-sm font-medium text-gray-700 border-b border-gray-200">
    <div className="col-span-3">Order number</div>
    <div className="col-span-4">Product</div>
    <div className="col-span-2">Date</div>
    <div className="col-span-2">Total payment</div>
    <div className="col-span-1">Status</div>
  </div>
);