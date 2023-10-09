import React, { useState } from 'react';

export const Main = () => {
    const [age, setAge] = useState(""); 
    const [showYoungerJokes, setShowYoungerJokes] = useState(false); 
    const [showOlderJokes, setShowOlderJokes] = useState(false); 
    const [userJoke, setUserJoke] = useState(""); 
    const [userJokes, setUserJokes] = useState([]); 

    const handleAgeChange = (event) => {
        const selectedAge = event.target.value;
        setAge(selectedAge);

        // Determine which joke sections to show based on the selected age
        if (selectedAge === "younger-18") {
            setShowYoungerJokes(true);
            setShowOlderJokes(false);
        } else if (selectedAge === "older-18") {
            setShowYoungerJokes(false);
            setShowOlderJokes(true);
        } else {
            setShowYoungerJokes(false);
            setShowOlderJokes(false);
        }
    }

    // Function to handle form submission
    const handleSubmit = () => {
        // Age-related actions can be performed here if needed
    }

    // Function to handle user joke input
    const handleUserJokeChange = (event) => {
        setUserJoke(event.target.value);
    }

    // Function to add user joke to the list
    const addUserJoke = () => {
        if (userJoke.trim() !== "") {
            setUserJokes([...userJokes, { joke: userJoke, rating: null }]);
            setUserJoke(""); // Clear the input field
        }
    }

    // Function to handle rating of a user-submitted joke
    const rateUserJoke = (index, rating) => {
        const updatedUserJokes = [...userJokes];
        updatedUserJokes[index].rating = rating;
        setUserJokes(updatedUserJokes);
    }

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

            {/* Conditionally render jokes based on the age selection */}
            {showYoungerJokes && (
                <div>
                    <h2>Jokes for Younger Than 18</h2>
                    <p>Rate what you think is your most favorite joke!!</p>
                    {/* Display jokes suitable for younger audiences */}
                </div>
            )}
            {showOlderJokes && (
                <div>
                    <h2>Jokes for 18 and Older</h2>
                    <p>Rate what you think is your most favorite joke!!</p>
                    {/* Display jokes suitable for adults */}
                </div>
            )}
            {/* Allow users to input jokes */}
            {(showYoungerJokes || showOlderJokes) && (
                <div>
                    <h2>Submit Your Jokes</h2>
                    <input type="text" value={userJoke} onChange={handleUserJokeChange} />
                    <button type="button" onClick={addUserJoke}>Submit Joke</button>
                </div>
            )}
            {/* Display user-submitted jokes */}
            {(showYoungerJokes || showOlderJokes) && (
                <div>
                    <h2>User-Submitted Jokes</h2>
                    {userJokes.map((jokeObj, index) => (
                        <div key={index}>
                            <p>{jokeObj.joke}</p>
                            <div>
                                <button onClick={() => rateUserJoke(index, 1)}>Like</button>
                                <button onClick={() => rateUserJoke(index, -1)}>Dislike</button>
                            </div>
                            <p>Rating: {jokeObj.rating === null ? "Not Rated" : jokeObj.rating}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
