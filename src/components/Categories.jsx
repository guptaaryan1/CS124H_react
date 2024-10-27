import React from 'react';


const Categories = () => {
    return (
        <div className="categories-container">
            <div className="gear-icon">&#9881;</div>
            <h1>Categories</h1>
            <div className="categories-box">
                <button className="category-button create-category">
                    <span className="search-icon">&#128269;</span> Create your own category!
                </button>
                <button className="category-button">Category 1</button>
                <button className="category-button">Category 2</button>
            </div>
        </div>
    );
};

export default Categories;
