import { useState, useRef, useEffect} from "react";
import SmallArticleDisplay from "../SmallArticleDisplay/SmallArticleDisplay";
import "./SearchSection.css"
import { searchArticle, getArticles, getIndustries, getCategories, getAuthors } from "../../api";

/**
 * @param {{
 *  articles: any[]
 *  removeCallBack: (x: any) => void
 * }} attributes
 */
export default function SearchSection() {

    const [articles, setArticles] = useState([])
    const [activeDropdown, setActiveDropdown] = useState("");
    const [dropdownContents, setDropdownContents] = useState([]);
    function setDropdown(name) {
        if (activeDropdown === name) {
            setDropdownContents([])
            return setActiveDropdown("")
        }
        setActiveDropdown(name)
        if (name === "author") setDropdownContents(allauthors.map(a => a.name))
        if (name === "category") setDropdownContents(allcategories.map(a => a.content))
        if (name === "industry") setDropdownContents(allindustries.map(a => a.content))
    }

    useEffect(() => {
        console.log(dropdownContents)
    }, [dropdownContents])

    // these three are just the list of all of them
    const [allcategories, setAllCategories] = useState([])
    const [allindustries, setAllIndustries] = useState([])
    const [allauthors, setAllAuthors] = useState([])
    useEffect(() => {
        getArticles().then(setArticles)
        getCategories().then(setAllCategories)
        getIndustries().then(setAllIndustries)
        getAuthors().then(setAllAuthors)
    }, [])
    //these are the ones we want to use in the filter
    const [categories, setCategories] = useState([])
    const [industries, setIndustries] = useState([])
    const [authors, setAuthors] = useState([])
    useEffect(() => {
        searchArticle(undefined,
            categories.length ? categories : undefined,
            industries.length ? industries : undefined,
            authors.length ? authors : undefined)
        .then(setArticles)
    }, [categories, authors, industries])

    const strmap = {
        "author": authors,
        "category": categories,
        "industry": industries,
    }
    const setmap = {
        "author": setAuthors,
        "category": setCategories,
        "industry": setIndustries,
        
    }
    function toggleTag(name) {
        // mutate state
        if (!strmap[activeDropdown].includes(name))
            setmap[activeDropdown]([name, ...strmap[activeDropdown]])
        else
            setmap[activeDropdown](strmap[activeDropdown].filter(a => a != name))

    }

    return <>
        <div className="middleSearchBar">
            <div className="middleSearchBarTab bold">
                FILTER BY
            </div>
            <div className="middleSearchBarTab" onClick={() => setDropdown("author")}>
                AUTHOR
                {activeDropdown === "author" ? 
                <span className="material-symbols-outlined big">arrow_drop_up</span> :
                <span className="material-symbols-outlined big">arrow_drop_down</span>}
            </div>
            <div className="middleSearchBarTab" onClick={() => setDropdown("category")}>
                CATEGORY
                {activeDropdown === "category" ? 
                <span className="material-symbols-outlined big">arrow_drop_up</span> :
                <span className="material-symbols-outlined big">arrow_drop_down</span>}
            </div>
            <div className="middleSearchBarTab" onClick={() => setDropdown("industry")}>
                INDUSTRY
                {activeDropdown === "industry" ? 
                <span className="material-symbols-outlined big">arrow_drop_up</span> :
                <span className="material-symbols-outlined big">arrow_drop_down</span>}
            </div>
            <div className="flexPad"></div>
            <div className="middleSearchBarTab clearAll" onClick={() => {
                setIndustries([])
                setCategories([])
                setAuthors([])
            }}>
                Clear All
            </div>
        </div>

        <div className="filterSelection">
            { dropdownContents.map(name =>
                <div key={name}
                    className={`filterEntry ${strmap[activeDropdown].includes(name) ? "bold" : ""}`}
                    onClick={() => toggleTag(name)}>
                    {name}
                </div>
            )}
        </div>

        <div className="articles">
            {articles.map((article) =>
            <SmallArticleDisplay
                article={article}
                key={article._id}/>
            )}
        </div>
    </>

}
