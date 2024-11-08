// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './App.css'; 
// export default function App() {
//   const [dt, setDt] = useState([]);

//   useEffect(() => {
//    axios.get('http://localhost:4000/post').then(res=>setDt(res.data)).catch(err=>console.log(err));
//   }, []);
//  console.log(dt)
//   return (
//      <div>
//       {dt.map((item, index) => (
//         <div key={index} >
//           <h2>{item.title}</h2>
//           <p>{item.body}</p>
//         </div>
//       ))}
//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {
  const [dt, setDt] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // First, try to load data from localStorage
    const cachedData = localStorage.getItem('cachedJokes');
    if (cachedData) {
      setDt(JSON.parse(cachedData));
      setLoading(false);
    }

    // Then fetch fresh data from the server
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:4000/post');
      setDt(response.data);
      setError(null);
      // Cache the data in localStorage
      localStorage.setItem('cachedJokes', JSON.stringify(response.data));
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Unable to fetch new data. Showing cached data if available.');
      
      // If we don't have any data at all (no cache, no server response)
      if (dt.length === 0) {
        setError('No data available. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {error && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          {error}
        </div>
      )}
      
      {dt.length > 0 ? (
        dt.map((item, index) => (
          <div key={index} className="mb-4 p-4 border rounded">
            <h2 className="text-xl font-bold">{item.title}</h2>
            <p className="mt-2">{item.body}</p>
          </div>
        ))
      ) : (
        <div className="text-center p-4">
          <p>No data available</p>
        </div>
      )}
      
      <button 
        onClick={fetchData}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Refresh Data
      </button>
    </div>
  );
}