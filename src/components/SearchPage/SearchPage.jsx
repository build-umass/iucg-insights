import { useEffect, useState } from "react";
import { getCategories, getIndustries, searchArticle } from "../../api";
import "./SearchPage.css";
import SearchPageArticle from "../SearchPageArticle/SearchPageArticle";
import 'material-symbols';
import { useSearchParams } from "react-router-dom";
import MainPage from "../MainPage/MainPage"


/**
 * @param {string} value 
 * @param {string[]} list 
 * @returns {string[]}
 */
function select(value, list) {
  const out = list.map(x => x);
  out.push(value);
  return out;
}

/**
 * @param {string} value 
 * @param {string[]} list 
 * @returns {string[]}
 */
function deselect(value, list) {
  return list.filter(x => x !== value);
}

/**
 * Converts a list into null if it is empty
 * @param {string[]} list 
 * @returns {string[] | null}
 */
function nullify(list) {
  return list.length === 0 ? null : list;
}

export default function SearchPage({ isActive, close }) {
  /**
   * Currently does nothing since articles are sorted by relevance by default.
   */
  function sortByRelevance() { }
  const searchParams = useSearchParams()[0];

  const [categories, setCategories] = useState(null);
  const [industries, setIndustries] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [industryFilter, setIndustryFilter] = useState([]);
  const [titleQuery, setTitleQuery] = useState(searchParams.get("query"));
  const [articles, setArticles] = useState([]);

  // Fetch Async Data
  useEffect(() => {
    getCategories().then(setCategories);
    getIndustries().then(setIndustries);
  }, []);

  // Fetch articles
  useEffect(() => {
    searchArticle(titleQuery, nullify(categoryFilter), nullify(industryFilter)).then(setArticles)
  }, [titleQuery, categoryFilter, industryFilter]);

  // Generate category menu
  let categoryMenu = <div>Loading...</div>
  if (categories !== null) {
    categoryMenu = categories
      .map((category, key) => {
        const name = category.content;
        const count = category.count;
        const isSelected = categoryFilter.includes(name);
        const text = `${name} (${count})`;
        if (isSelected) {
          return <div
            className="selected search-option"
            onClick={() => setCategoryFilter(deselect(name, categoryFilter))}
            key={key}
          >
            {text}
          </div>
        } else {
          return <div
            className="search-option"
            onClick={() => setCategoryFilter(select(name, categoryFilter))}
            key={key}
          >
            {text}
          </div>
        }
      })
  }

  // Generate industry menu
  let industryMenu = <div>Loading...</div>
  if (industries !== null) {
    industryMenu = industries
      .map((industry, key) => {
        const name = industry.content;
        const count = industry.count;
        const isSelected = industryFilter.includes(name);
        const text = `${name} (${count})`;
        if (isSelected) {
          return <div
            className="selected search-option"
            onClick={() => setIndustryFilter(deselect(name, industryFilter))}
            key={key}
          >
            {text}
          </div>
        } else {
          return <div
            className="search-option"
            onClick={() => setIndustryFilter(select(name, industryFilter))}
            key={key}
          >
            {text}
          </div>
        }
      })
  }

  // Generate article elements
  let articleList = articles.map((article, key) =>
    <SearchPageArticle
      article={article}
      key={key}
    ></SearchPageArticle>);

  // Add horizontal bars
  // TODO add more articles in order to test this
  const articleCount = articleList.length;
  for (let i = articleCount - 2; i >= 0; i--) {
    articleList.splice(i, 0, <hr key={`bar ${i}`}></hr>)
  }

  return <div className={isActive ? "active" : ""} id="search-outer-container">
    <div className={"search-page-container"}>
      <div className="flex-row results-counter">Showing {articles.length} results for</div>
      <div className="flex-row search-row">
        <input id="search-bar" onChange={e => setTitleQuery(e.target.value)} defaultValue={searchParams.get("query") ?? ""}></input>
        <label htmlFor="search-bar">
          <span className="search-icon">search</span>
        </label>
        <div onClick={sortByRelevance} className="sort-by-relevance">Sort By Relevance</div>
      </div>
      <div className="flex-row bottom-panel">
        <div className="control-panel flex-column">
          <div>
            <h3>TOPIC</h3>
            <hr />
            {categoryMenu}
          </div>
          <div>
            <h3>INDUSTRY</h3>
            <hr />
            {industryMenu}
          </div>
        </div>
        <div className="flex-column article-listing">
          {articleList}
        </div>
      </div>
      <div
        className="material-symbols-outlined close-button"
        onClick={close}
        htmlFor="top-search-bar">close</div>
    </div>
  </div>;
}
