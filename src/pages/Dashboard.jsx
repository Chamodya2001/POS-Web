export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">POS Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-500 text-white p-4 rounded-xl">
          Total Sales
        </div>
        <div className="bg-green-500 text-white p-4 rounded-xl">
          Products
        </div>
        <div className="bg-purple-500 text-white p-4 rounded-xl">
          Orders
        </div>
      </div>
    </div>
  );
}
