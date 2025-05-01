interface HeaderProps {
  totalBalance: number;
}

export default function Header({ totalBalance }: HeaderProps) {
  return (
    <header className="mb-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Expense Tracker</h1>
          <p className="text-gray-600">Track your spending and manage your budget</p>
        </div>
        <div className="flex items-center space-x-4">
          <a href="/account" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Go to Account
          </a>
          <div className="bg-white rounded-lg shadow p-3">
            <div className="text-sm text-gray-500">Total Balance</div>
            <div className={`text-xl font-semibold ${totalBalance < 0 ? 'text-red-500' : ''}`}>
              ${totalBalance.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}