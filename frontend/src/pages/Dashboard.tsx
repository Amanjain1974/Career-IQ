export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Placeholder cards */}
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500 truncate">Total Applications</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">12</dd>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500 truncate">Job Fit Average</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">84%</dd>
        </div>
      </div>
    </div>
  );
}
