import { useState, useRef, useEffect} from "react";
import SmallArticleDisplay from "../SmallArticleDisplay/SmallArticleDisplay";
import "./SearchSection.css"

/**
 * @param {{
 *  articles: any[]
 *  removeCallBack: (x: any) => void
 * }} attributes
 */
export default function SearchSection({articles, removeCallBack}){
    /** @type {[string, (x: string) => void]} */
    const [activeDropdown, setActiveDropdown] = useState("");
    const [filterSettings, setFilterSettings] = useState({
        author: "",
        category: "",
        industry: "",
    });
    console.log(articles);
    console.log(filterSettings);

    function applyFilter(type, value){
        const newSettings = {...filterSettings};
        if(newSettings[type] === value){
            newSettings[type] = "";
        } else {
            newSettings[type] = value;
        }
        setFilterSettings(newSettings);
    }

    const filterOpen = activeDropdown !== "";
    // TODO fetch this from DB once API is implemented
    const categoryList = activeDropdown === "" ? [] : [
        "TODO",
        "fetch",
        "this",
        "from",
        "DB",
        "once",
        "API",
        "is",
        "implemented",
    ]

    return <>
        <div className="middleSearchBar">
            <div className="middleSearchBarTab bold">
                FILTER BY
            </div>
            <div className="middleSearchBarTab" onClick={() => setActiveDropdown(activeDropdown === "author" ? "" : "author")}>
                AUTHOR
                {activeDropdown === "author" ? 
                <span className="material-symbols-outlined big">arrow_drop_up</span> :
                <span className="material-symbols-outlined big">arrow_drop_down</span>}
            </div>
            <div className="middleSearchBarTab" onClick={() => setActiveDropdown(activeDropdown === "category" ? "" : "category")}>
                CATEGORY
                {activeDropdown === "category" ? 
                <span className="material-symbols-outlined big">arrow_drop_up</span> :
                <span className="material-symbols-outlined big">arrow_drop_down</span>}
            </div>
            <div className="middleSearchBarTab" onClick={() => setActiveDropdown(activeDropdown === "industry" ? "" : "industry")}>
                INDUSTRY
                {activeDropdown === "industry" ? 
                <span className="material-symbols-outlined big">arrow_drop_up</span> :
                <span className="material-symbols-outlined big">arrow_drop_down</span>}
            </div>
            <div className="flexPad"></div>
            <div className="middleSearchBarTab">
                Clear All
            </div>
        </div>

        <div className={`filterSelection ${filterOpen ? "" : "minimized"}`}>
            {categoryList.map(category => <div key={category} className="filterEntry" onClick={() => applyFilter(activeDropdown, category)}>
                {category}
            </div>)}
        </div>

        <div className="articles">
            {articles.map((article) =>
            <SmallArticleDisplay
                article={article}
                key={article._id}
                removeCallback={()=>removeCallBack(article)}/>
            )}
        </div>
    </>

}