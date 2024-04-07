import { useEffect, useState } from "react";
import { getCategories, getIndustries, searchArticle } from "../../api";
import "./SearchPage.css";
import SearchPageArticle from "../SearchPageArticle/SearchPageArticle";


/**
 * @param {string} value 
 * @param {string[]} list 
 * @returns {string[]}
 */
function select(value, list){
  const out = list.map(x => x);
  out.push(value);
  return out;
}

/**
 * @param {string} value 
 * @param {string[]} list 
 * @returns {string[]}
 */
function deselect(value, list){
  return list.filter(x => x !== value);
}

export default function SearchPage() {
  /**
   * Currently does nothing since articles are sorted by relevance by default.
   */
  function sortByRelevance() { }

  const [categories, setCategories] = useState(null);
  const [industries, setIndustries] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [industryFilter, setIndustryFilter] = useState([]);
  const [articles, setArticles] = useState([]);

  // Fetch Async Data
  useEffect(() => {
    getCategories().then(setCategories);
    getIndustries().then(setIndustries);
  }, []);

  // Sync default filters with lists
  useEffect(() => {
    if(categories)
      setCategoryFilter(categories.map(category => category.content))
  }, [categories]);
  useEffect(() => {
    if(industries)
      setIndustryFilter(industries.map(industry => industry.content))
  }, [industries]);

  // Fetch articles
  useEffect(() => {
    // TODO: add title functionality
    searchArticle("", categoryFilter, industryFilter).then(setArticles)
  }, [categoryFilter, industryFilter]);

  // Generate category menu
  let categoryMenu = <div>Loading...</div>
  if (categories !== null) {
    categoryMenu = categories
      .map((category, key) => {
        const name = category.content;
        const count = category.count;
        const isSelected = categoryFilter.includes(name);
        const text = `${name}(${count})`;
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
        const text = `${name}(${count})`;
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

  return <div className="search-page-container">
    <div className="flex-row">Showing {articles.length} results for</div>
    <div className="flex-row">
      <input id="search-bar"></input>
      <label for="search-bar">TODO Mag Glass</label>
      <div onClick={sortByRelevance}>Sort By Relevance</div>
    </div>
    <div className="flex-row">
      <div className="">
        TOPIC
        <hr />
        {categoryMenu}
        INDUSTRY
        <hr />
        {industryMenu}
      </div>
      <div className="flex-column">
        {articleList}
      </div>
    </div>
  </div>;
}