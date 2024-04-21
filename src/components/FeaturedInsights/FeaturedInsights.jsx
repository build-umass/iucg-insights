import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./FeaturedInsights.css"
import 'material-symbols';
import { Carousel } from "react-responsive-carousel";
import { useEffect, useState } from "react";
import { BASE_URL, getArticles } from "../../api";
import { useNavigate } from "react-router-dom";

export default function FeaturedInsights() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [featuredArticles, setFeaturedArticles] = useState([]);

    useEffect(() => {
        getArticles().then(articleList => setFeaturedArticles(articleList.slice(0, 6)));
    }, []);
    console.log(featuredArticles);
    const panelList = featuredArticles.map((article, index) => {
        return <FeaturedArticleComponent
            article={article}
            key={index}
        ></FeaturedArticleComponent>
    });

    const dotDisplay = featuredArticles.map((_, index) => {
        if (index === currentSlide) {
            return <div key={index} className="material-symbols-outlined dot selected-dot">circle</div>
        } else {
            return <div key={index} className="material-symbols-outlined dot">circle</div>
        }
    });

    return <div id="featured-article-section">
        <h2 id="featured-insights-title">Featured Insights</h2>
        <Carousel
            showIndicators={false}
            showThumbs={false}
            showStatus={false}
            showArrows={false}
            selectedItem={currentSlide}
        >
            {panelList}
        </Carousel>
        <div id="featured-insights-control-panel">
            <div className="material-symbols-outlined arrow" onClick={() => {
                setCurrentSlide(Math.max(currentSlide - 1, 0))
            }}>arrow_left</div>

            {dotDisplay}

            <div className="material-symbols-outlined arrow" onClick={() => {
                setCurrentSlide(Math.min(currentSlide + 1, featuredArticles.length - 1))
            }}>arrow_right</div>
        </div>
    </div>
}

function FeaturedArticleComponent({ article }) {
    const navigate = useNavigate();
    const createdDate = new Date(article.created);
    return <div className="featured-article">
        <div className="article-content">
            <img
                className="featured-article-image"
                src={`${BASE_URL}/api/images/${article.contentImgID}`}
                alt={article.title}
                onClick={() => navigate(`/articles/${article._id}`)}
            ></img>
            <div className="featured-article-left-content">
                <h3 className="featured-article-title" onClick={() => navigate(`/articles/${article._id}`)}>{article.title}</h3>
                <div className="featured-article-category">{article.categories.join(", ")}</div>
                <div className="featured-article-date">{createdDate.toLocaleString('en-EN', {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                })}</div>
                <div className="featured-article-synopsis">{article.synopsis}</div>
            </div>
        </div>
    </div>
}