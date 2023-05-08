import { searchArticle } from "../../api"
import { useState } from "react";

const SearchBar = ({ setArticles }) => {
  const [searchText, setSearchText] = useState('');
  const handleSubmit = async (event) => {
    event.preventDefault();
    const articles = await searchArticle(searchText);
    if (articles === undefined) {
      setArticles([]);
    } else {
      setArticles(articles);
    }
  };
  
  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="password">Search</label>
      <input
        type="search"
        id="search"
        name="search"
        value={searchText}
        onChange={handleSearchChange}
        />
      <button type="submit">Submit</button>
    </form>
  );
}

export default SearchBar;
