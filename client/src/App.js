import React, { useState } from 'react';
import axios from 'axios';
import './styles.css'; // Import the CSS file
const App = () => {
  const [symbolRow, setSymbolRow] = useState('');
  const [date, setDate] = useState('');
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      setError(null);
        const symbol = symbolRow.toUpperCase();
      // Make a request to the server API
      const response = await axios.post('http://localhost:5000/api/fetchStockData', { symbol, date });

      // Update the state with the received stock data
      setStockData(response.data);
    } catch (error) {
      console.error('Error fetching stock data:', error);
      setError('An error occurred while fetching stock data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="heading">Stock Trade Statistics</h1>
      <form className="form" onSubmit={handleSubmit}>
        <label className="form-label">
          Stock Symbol:
          <input
            type="text"
            value={symbolRow}
            onChange={(e) => setSymbolRow(e.target.value)}
            required
            className="form-input"
            placeholder="Enter stock symbol"
          />
        </label>
        <label className="form-label">
          Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="form-input"
          />
        </label>
        <button type="submit" className="form-button" disabled={loading}>
          {loading ? 'Fetching...' : 'Fetch Stock Data'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {stockData && (
        <div className="stock-data">
          <h2 className="stock-data-heading">Stock Data</h2>
          <table className="stock-table">
            <thead>
              <tr>
                <th>Open</th>
                <th>High</th>
                <th>Low</th>
                <th>Close</th>
                <th>Volume</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{stockData.open}</td>
                <td>{stockData.high}</td>
                <td>{stockData.low}</td>
                <td>{stockData.close}</td>
                <td>{stockData.volume}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default App;
