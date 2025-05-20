// client/src/App.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  const dateFrom = '2025-05-01';
  const dateTo = '2025-05-20';

  useEffect(() => {
    async function fetchReport() {
      try {
        const res = await axios.get(`/api/report?dateFrom=${dateFrom}&dateTo=${dateTo}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchReport();
  }, []);

  const toggleExpand = (sku) => {
    setExpanded((prev) => ({ ...prev, [sku]: !prev[sku] }));
  };

  if (loading) return <div className="p-6">Loading report...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Inventory Report</h1>
      <table className="w-full border text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">SKU</th>
            <th className="p-2">Description</th>
            <th className="p-2">Qty Sold</th>
            <th className="p-2">Revenue</th>
            <th className="p-2">Orders</th>
            <th className="p-2">Cost</th>
            <th className="p-2">Details</th>
          </tr>
        </thead>
        <tbody>
          {data.map((skuItem) => (
            <>
              <tr key={skuItem.sku} className="border-b">
                <td className="p-2 font-mono">{skuItem.sku}</td>
                <td className="p-2">{skuItem.description}</td>
                <td className="p-2">{skuItem.totalQuantitySold}</td>
                <td className="p-2">${skuItem.totalRevenue.toFixed(2)}</td>
                <td className="p-2">{skuItem.totalOrders}</td>
                <td className="p-2">${skuItem.cost?.toFixed(2) ?? 'N/A'}</td>
                <td className="p-2">
                  <button onClick={() => toggleExpand(skuItem.sku)} className="text-blue-500 hover:underline">
                    {expanded[skuItem.sku] ? 'Hide' : 'Show'}
                  </button>
                </td>
              </tr>
              {expanded[skuItem.sku] && skuItem.stores.map((store) => (
                <tr key={skuItem.sku + '-' + store.storeId} className="bg-gray-50 text-sm">
                  <td className="p-2 pl-6" colSpan={2}>Store ID {store.storeId}</td>
                  <td className="p-2">{store.quantitySold}</td>
                  <td className="p-2">${store.revenue.toFixed(2)}</td>
                  <td className="p-2">{store.orders}</td>
                  <td className="p-2" colSpan={2}></td>
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
