import React, { useState, useEffect } from 'react';
import { gettags, deletetag, filterArticles } from '../../api';

export default function ArticleFilter({ setArticles }) {
  const [tags, setTags] = useState([]);

  // Get tags
  useEffect(() => {
    getTags();
  }, []);

  // Fetch tags
  const getTags = async () => {
    try {
      const tagsData = await gettags();
      setTags(tagsData);
    } catch (error) {
      console.error('Failed to fetch tags', error);
    }
  };

  // Delete tag
  const deleteTagById = async (id) => {
    try {
      await deletetag(id);
      getTags(); // Refresh the tags after deletion
    } catch (error) {
      console.error('Failed to delete tag', error);
    }
  };

  // Filter articles by tag
  const filterArticles = async (tag) => {
    try {
      const filteredArticles = await filterArticles(tag);
      setArticles(filteredArticles);
    } catch (error) {
      console.error('Failed to filter articles', error);
    }
  };

  return (
    <div className="article-filter">
      <h4>Filter by tags</h4>
      <div>
        Current tags:
        {tags.map((tag) => (
          <div className="tag" key={tag._id}>
            <span>Tag: {tag.content}</span>
            <button onClick={() => deleteTagById(tag._id)}>Delete</button>
            <button onClick={() => filterArticles(tag.content)}>Filter</button>
          </div>
        ))}
      </div>
    </div>
  );
}
