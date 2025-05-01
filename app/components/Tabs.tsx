interface TabsProps {
    activeTab: 'regular' | 'recurring';
    setActiveTab: (tab: 'regular' | 'recurring') => void;
  }
  
  export default function Tabs({ activeTab, setActiveTab }: TabsProps) {
    return (
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 mr-2 ${activeTab === 'regular' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('regular')}
        >
          Regular Expenses
        </button>
        <button
          className={`px-4 py-2 mr-2 ${activeTab === 'recurring' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('recurring')}
        >
          Recurring Payments
        </button>
      </div>
    );
  }