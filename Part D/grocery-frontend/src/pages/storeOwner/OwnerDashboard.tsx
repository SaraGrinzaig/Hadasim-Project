import { Link } from 'react-router-dom';

export default function OwnerDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Owner Dashboard</h1>
      <div className="space-y-4">
        <Link to="/store-owner/all-orders" className="block bg-blue-500 text-white p-4 rounded shadow hover:bg-blue-600">
          View All Orders
        </Link>
        <Link to="/store-owner/create-order" className="block bg-green-500 text-white p-4 rounded shadow hover:bg-green-600">
          Create New Order
        </Link>
      </div>
    </div>
  );
}
