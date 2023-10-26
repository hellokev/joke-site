import React, { useState } from 'react';

export const Main = () => {
    const [age, setAge] = useState(""); 
    const [userJoke, setUserJoke] = useState(""); 
    const [userJokeImage, setUserJokeImage] = useState(null);
    const [userJokes, setUserJokes] = useState([]); 
    const [sortMethod, setSortMethod] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const jokesPerPage = 10; // Number of jokes to display per page

    const handleAgeChange = (event) => {
        const selectedAge = event.target.value;
        setAge(selectedAge);
    }

    const handleUserJokeChange = (event) => {
        setUserJoke(event.target.value);
    }

    const handleUserJokeImageChange = (event) => {
        setUserJokeImage(event.target.files[0]);
    }

    const addUserJoke = () => {
        if (userJoke.trim() !== "") {
            setUserJokes([...userJokes, { joke: userJoke, image: userJokeImage, rating: null, age: age, date: new Date() }]);
            setUserJoke(""); 
            setUserJokeImage(null);
        }
    }

    const rateUserJoke = (date, rating) => {
        const updatedUserJokes = [...userJokes];
        const jokeIndex = updatedUserJokes.findIndex(joke => joke.date === date);
        if (jokeIndex !== -1) {
            updatedUserJokes[jokeIndex].rating = rating;
            setUserJokes(updatedUserJokes);
        }
    }

    const handleSortChange = (event) => {
        setSortMethod(event.target.value);
    };

    const sortedUserJokes = userJokes.slice().sort((a, b) => {
        if (sortMethod === "newest") {
            return b.date - a.date; 
        } else if (sortMethod === "mostLikes") {
            return (b.rating || 0) - (a.rating || 0); 
        }
        return 0;
    });

    const indexOfLastJoke = currentPage * jokesPerPage;
    const indexOfFirstJoke = indexOfLastJoke - jokesPerPage;
    const currentJokes = sortedUserJokes.slice(indexOfFirstJoke, indexOfLastJoke);

    return (
        <div>
            <h1>Jokes!</h1>
            <p>Welcome to my joke website</p>
            <h2>Terms</h2>
            <p>We require an age check to determine what types of jokes you will be able to view. Thank you!</p>
            <div className="form-group">
                <label htmlFor="age-check">Age Requirement</label>
                <select id="age-check" className="form-control" name="age" onChange={handleAgeChange} value={age}>
                    <option value="">None</option>
                    <option value="younger-18">Younger than 18</option>
                    <option value="older-18">Older than 18</option>
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="sort-method">Sort By:</label>
                <select id="sort-method" className="form-control" name="sortMethod" onChange={handleSortChange} value={sortMethod}>
                    <option value="newest">Newest</option>
                    <option value="mostLikes">Most Likes</option>
                </select>
            </div>

            <div className="pagination">
                {Array.from({ length: Math.ceil(sortedUserJokes.length / jokesPerPage) }, (_, i) => (
                    <button key={i} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                ))}
            </div>

            {age === "older-18" && (
                <div>
                    <h2>Jokes for 18 and Older</h2>
                    <p>Rate your favorite jokes!</p>
                    <div>
                        <h2>Submit Your Jokes</h2>
                        <input type="text" value={userJoke} onChange={handleUserJokeChange} />
                        <input type="file" accept=".jpg, .jpeg, .png, .gif" onChange={handleUserJokeImageChange} />
                        <button type="button" onClick={addUserJoke}>Submit Joke</button>
                    </div>
                </div>
            )}

            {(age === "younger-18" || age === "") && (
                <div>
                    <h2>Jokes for Younger Than 18</h2>
                    <p>Rate your favorite jokes!</p>
                    {age === "younger-18" && (
                        <div>
                            <h2>Submit Your Jokes</h2>
                            <input type="text" value={userJoke} onChange={handleUserJokeChange} />
                            <input type="file" accept=".jpg, .jpeg, .png, .gif" onChange={handleUserJokeImageChange} />
                            <button type="button" onClick={addUserJoke}>Submit Joke</button>
                        </div>
                    )}
                </div>
            )}

            {currentJokes.map((jokeObj, index) => (
                (age === "older-18" || jokeObj.age === "younger-18" || age === "") && (
                    <div key={index}>
                        <div>
                            <p>{jokeObj.joke}</p>
                            {jokeObj.image && <img src={URL.createObjectURL(jokeObj.image)} alt="User Joke" />}
                        </div>
                        <div>
                            <button onClick={() => rateUserJoke(jokeObj.date, 1)}>Like</button>
                            <button onClick={() => rateUserJoke(jokeObj.date, -1)}>Dislike</button>
                        </div>
                        <p>Rating: {jokeObj.rating === null ? "Not Rated" : jokeObj.rating}</p>
                    </div>
                )
            ))}
        </div>
        );
}
