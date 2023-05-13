import React, { useState, useEffect } from 'react';
import { gettags } from '../../api';

export default function ArticleFilter({ articles, setArticles }) {
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  // get tags
  useEffect(() => { gettags().then(setTags) }, []);

  // filter articles by tags
  useEffect(() => {
    if (selectedTags.length === 0) {
      setArticles(articles);
    } else {
      setArticles(articles.filter((article) => {
        return selectedTags.every((tag) => article.tags.includes(tag));
      }));
    }
  }, [selectedTags]);

  // add or remove tags from selectedTags
  // const toggleTag = (tag) => {
  //   if (selectedTags.includes(tag)) {
  //     setSelectedTags(selectedTags.filter((selectedTag) => selectedTag !== tag));
  //   } else {
  //     setSelectedTags([...selectedTags, tag]);
  //   }
  // };

  return (
    <div className="article-filter">
      <h4>Filter by tags</h4>
      <div className="tags">
        {/* {tags.map((tag) => (
          <div
            className={`tag ${selectedTags.includes(tag) ? 'selected' : ''}`}
            onClick={() => toggleTag(tag)}
            key={tag}
          >
            {tag}
          </div>
        ))} */}
        Current tags:
        {selectedTags.map((tag) => (
          <div className="tag" key={tag}>
            {tag}
          </div>
        ))}
      </div>
    </div>
  );
}
