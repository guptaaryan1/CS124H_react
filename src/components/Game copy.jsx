import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Game.css'; // Optional: Add a custom CSS file for the game.

const GameCopy = () => {
    const [category, setCategory] = useState('');
    const [companies, setCompanies] = useState([]);
    const [companyLogos, setCompanyLogos] = useState([]);
    const [logoIndex, setLogoIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [hint, setHint] = useState('');
    const navigate = useNavigate();

    // Fetch company names using Hugging Face API (GPT-Neo)
    const fetchCompanies = async (category) => {
        try {
            const response = await fetch('https://api-inference.huggingface.co/models/EleutherAI/gpt-neo-2.7B', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer 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`,  // Replace with your Hugging Face API key
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputs: `List 5 companies related to the category: ${category}`,
                }),
            });

            const data = await response.json();
            const companiesList = data[0].generated_text
                .split('\n')
                .map((name) => name.trim())
                .filter((name) => name);

            setCompanies(companiesList);
            await fetchLogos(companiesList); // Fetch logos after getting company names
        } catch (error) {
            console.error('Error fetching companies:', error);
        }
    };

    // Fetch logos for the list of companies
    const fetchLogos = async (companiesList) => {
        const logos = [];
        for (const company of companiesList) {
            try {
                const logoUrl = `https://logo.clearbit.com/${company}.com`;
                const logoResponse = await axios.get(logoUrl);
                logos.push(logoResponse.config.url); // Get the URL of the logo image
            } catch (error) {
                logos.push('https://via.placeholder.com/150'); // Fallback if logo is not found
            }
        }
        setCompanyLogos(logos);
    };

    // Handle category input change
    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    };

    // Handle "Start Game" button click
    const startGame = async () => {
        if (category.trim()) {
            await fetchCompanies(category);
            setLogoIndex(0);  // Start from the first company
            setScore(0); // Reset the score
            setGameOver(false);
        }
    };

    // Handle user answer submission
    const handleSubmitAnswer = () => {
        if (userAnswer.toLowerCase() === companies[logoIndex].toLowerCase()) {
            setScore(score + 1);
            setHint('Correct!');
        } else {
            setHint(`Wrong! The correct answer was ${companies[logoIndex]}`);
        }

        // Move to the next logo
        if (logoIndex + 1 < companies.length) {
            setLogoIndex(logoIndex + 1);
        } else {
            setGameOver(true);
        }

        setUserAnswer(''); // Clear the input field
    };

    // Handle input change for the user's answer
    const handleAnswerChange = (e) => {
        setUserAnswer(e.target.value);
    };

    // Render Game over message
    const renderGameOver = () => {
        return (
            <div className="game-over">
                <h2>Game Over!</h2>
                <p>Your final score is: {score}</p>
                <button onClick={() => navigate('/')}>Go Home</button>
            </div>
        );
    };

    return (
        <div className="game-container">
            <h1>Category X Easy Mode</h1>

            {gameOver ? (
                renderGameOver()
            ) : (
                <>
                    <div className="category-input">
                        <input
                            type="text"
                            placeholder="Enter a category (e.g., water, tech, etc.)"
                            value={category}
                            onChange={handleCategoryChange}
                        />
                        <button onClick={startGame}>Start Game</button>
                    </div>

                    {companies.length > 0 && logoIndex < companies.length && (
                        <div className="game-content">
                            <div className="logo-display">
                                <h2>Guess the company:</h2>
                                <img
                                    src={companyLogos[logoIndex]}
                                    alt={`Logo for ${companies[logoIndex]}`}
                                    style={{ width: 150, height: 150 }}
                                />
                            </div>

                            <div className="answer-input">
                                <input
                                    type="text"
                                    placeholder="Guess the name of the company"
                                    value={userAnswer}
                                    onChange={handleAnswerChange}
                                />
                                <button onClick={handleSubmitAnswer}>Submit Answer</button>
                            </div>

                            <div className="hint">{hint}</div>
                            <div className="score">Score: {score}</div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default GameCopy;
