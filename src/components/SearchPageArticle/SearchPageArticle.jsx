import { useNavigate } from "react-router-dom";
import "./SearchPageArticle.css"

/**
 * 
 * @param {{
 *   article: {
 *     title: String,
 *     subtitle: String,
 *     synopsis: String,
 *     author: String,
 *     authorImgID: String,
 *     authorID: String,
 *     content: String,
 *     contentImgID: String,
 *     industries: [String],
 *     categories: [String],
 *     images: [String],
 *     created: { type: Date, default: Date.now },
 *     edited: { type: Date, default: Date.now }
 *   }
 * }} props 
 */
export default function SearchPageArticle(props) {
    const navigate = useNavigate();
    const navArticle = ()=>{
        navigate(`/articles/${props.article._id}`, {
            "replace": true
        });
        navigate(0);
    }
    return <div className="search-page-article" onClick={navArticle}>
        <h2 className="article-title">{props.article.title}</h2>
        <h3 className="article-subtitle">{props.article.subtitle}</h3>
        <div className="author-credits">by {props.article.author}</div>
        <div className="article-preview">{props.article.synopsis}</div>
    </div>
}