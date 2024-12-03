import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import Context from './context/context';
import Home from './components/Home/Home';

function App() {
  const [data, setData] = useState(null);
  const [grouping, setGrouping] = useState('status');
  const [ordering, setOrdering] = useState('priority');

  const fetchData = () => {
    axios.get('https://api.quicksell.co/v1/internal/frontend-assignment')
      .then((res) => {
        console.log('API response:', res.data);
        setData(res.data);
        localStorage.setItem('data', JSON.stringify(res.data));
      })
      .catch((err) => {
        console.error('API error:', err);
        alert(err);
      });
  };

  useEffect(() => {
    const savedData = localStorage.getItem('data');
    if (!savedData) {
      console.log('Fetching new data');
      fetchData();
    } else {
      console.log('Loading from localStorage');
      try {
        const parsedData = JSON.parse(savedData);
        setData(parsedData);
      } catch (err) {
        console.error('Error parsing localStorage data:', err);
        fetchData();
      }
    }
  }, []);

  return (
    <Context.Provider value={{ data, setData, grouping, setGrouping, ordering, setOrdering }}>
      <div className="App">
        <Home/>
      </div>
    </Context.Provider>
  );
}

export default App;
