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
    return <div className="search-page-article">
        <h1>{props.article.title}</h1>
        <h2>{props.article.subtitle}</h2>
        <h3>by {props.article.author}</h3>
        {props.article.content}
    </div>
}