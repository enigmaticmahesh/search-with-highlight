import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [search, setSearch] = useState('');

  const handleClear = () => {
    if (!search) {
      return;
    }
    setSearch('');
    handleSearch('');
  };

  const handleSearch = (query) => {
    console.log({ query });
    setSearch(query);
    if (!query) {
      setSearchedUsers([]);
      return;
    }
    setSearchedUsers(
      users.filter((user) => {
        const vals = Object.values(user);
        return new RegExp(query, 'gi').test(vals.toString());
      })
    );
  };

  useEffect(() => {
    fetch('http://www.mocky.io/v2/5ba8efb23100007200c2750c')
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => {
        console.log('Error while fetching Users Data');
        console.log({ err });
      });
  }, []);

  const usersList =
    searchedUsers.length > 0 ? (
      searchedUsers.map((user) => (
        <SearchItem key={user.id} user={user} search={search} />
      ))
    ) : search ? (
      <p>No User Found</p>
    ) : null;

  return (
    <div className="App">
      <div className="search__container">
        <span className="search__icon">🔍</span>
        <input
          type="text"
          placeholder="Search users by ID, address, nam..."
          onChange={(e) => handleSearch(e.target.value)}
          value={search}
        />
        <span className="clear__icon" onClick={handleClear}>
          &times;
        </span>
        <div className="search__results">{usersList}</div>
      </div>
    </div>
  );
}

function SearchItem({ user, search }) {
  const containerRef = useRef(null);
  const queryMatch = new RegExp(search, 'gi');

  const textForQueryFoundInItems = `"${search}" found in items`;
  const foundInItems = queryMatch.test(user.items.toString())
    ? `<ul><li>${textForQueryFoundInItems}</li></ul>`
    : '';

  const sourceItem = `
  <div className="search__item__container">
    <h6>${user.id}</h6>
    <p>${user.name}</p>
    <div>${foundInItems}</div>
    <p>
      ${user.address}, ${user.pincode}
    </p>
  </div>
`;

  if (containerRef.current?.innerHTML) {
    containerRef.current.innerHTML = sourceItem.replace(queryMatch, (match) => {
      return `<mark>${match}</mark>`;
    });
  }

  return (
    <div className="search__item__container" ref={containerRef}>
      <h6>{user.id}</h6>
      <p>{user.name}</p>
      <div>{foundInItems}</div>
      <p>
        {user.address}, {user.pincode}
      </p>
    </div>
  );
}

export default App;
