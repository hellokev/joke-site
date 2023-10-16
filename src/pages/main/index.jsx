import React, { useState } from 'react';
import { getDatabase, set, get, update, remove, ref, child } from "firebase/database";


export const Main = () => {
    const [age, setAge] = useState(""); 
    const [showYoungerJokes, setShowYoungerJokes] = useState(false); 
    const [showOlderJokes, setShowOlderJokes] = useState(false); 
    const [userJoke, setUserJoke] = useState(""); 
    const [userJokes, setUserJokes] = useState([]); 
    const [jokeId, setJokeId] = useState(0);

    const db = getDatabase();

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
    // This code is connected to the Firebase Database and stores jokes in a form of JSON into jokes/older-18 or jokes/younger-18.
    const handleSubmit = () => {
        if (userJoke.trim() !== "" && age === "older-18") {
            const newJoke = {
                id: jokeId,
                joke: userJoke,
                rating: 0,
                age: "+18"
            };
            setUserJokes([...userJokes, newJoke]);
            setUserJoke("");

            set(ref(db, `Jokes/older-18/${newJoke.id}`), newJoke)
            .then(() => {
                alert("Joke has been submitted!");
            })
            .catch((error) => {
                alert(error);
            });

            setJokeId(jokeId + 1);
        } else if (userJoke.trim() !== "" && age === "younger-18"){
            const newJoke = {
                id: jokeId,
                joke: userJoke,
                rating: 0,
                age: "<18"
            };
            setUserJokes([...userJokes, newJoke]);
            setUserJoke("");

            set(ref(db, `Jokes/younger-18/${newJoke.id}`), newJoke)
            .then(() => {
                alert("Joke has been submitted!");
            })
            .catch((error) => {
                alert(error);
            });
        }
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
                    {userJokes.map((jokeObj, index) => (
                        jokeObj.age === "<18" ? (
                            <div key={index}>
                                <p>{jokeObj.joke}</p>
                                <div>
                                    <button onClick={() => rateUserJoke(index, 1)}>Like</button>
                                    <button onClick={() => rateUserJoke(index, -1)}>Dislike</button>
                                </div>
                                <p>Rating: {jokeObj.rating === null ? "Not Rated" : jokeObj.rating}</p>
                            </div>
                        ) : null
                    ))}
                </div>
            )}
            {showOlderJokes && (
                <div>
                    <h2>Jokes for 18 and Older</h2>
                    <p>Rate what you think is your most favorite joke!!</p>
                    {userJokes.map((jokeObj, index) => (
                        jokeObj.age === "+18" ? (
                            <div key={index}>
                                <p>{jokeObj.joke}</p>
                                <div>
                                    <button onClick={() => rateUserJoke(index, 1)}>Like</button>
                                    <button onClick={() => rateUserJoke(index, -1)}>Dislike</button>
                                </div>
                                <p>Rating: {jokeObj.rating === null ? "Not Rated" : jokeObj.rating}</p>
                            </div>
                        ) : null
                    ))}
                </div>
            )}

            {/* Allow users to input jokes */}
            {(showYoungerJokes || showOlderJokes) && (
                <div>
                    <h2>Submit Your Jokes</h2>
                    <input type="text" value={userJoke} onChange={handleUserJokeChange} />
                    <button type="button" onClick={handleSubmit}>Submit Joke</button>
                </div>
            )}
            {/* Display user-submitted jokes */}
            {/* {(showYoungerJokes || showOlderJokes) && (
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
            )} */}
        </div>
    );
}

/* BUGS:
-Ratings not updating into Firebase
-*/

/* CHANGES:
BACKEND:
    -Added jokes to Firebase database categorized by age group.
        -Created two categories, "older-18" and "younger-18," to segregate jokes based on the age group.
        -Added jokes to the "older-18" category with age "+18" and corresponding IDs, jokes, and initial ratings.
        -Added jokes to the "younger-18" category with age "<18" and corresponding IDs, jokes, and initial ratings.
FRONTEND:
    -The younger/older joke filter wasn't working for me probably cause I broke the code some how but I added some changes to it so that it actually displays in this current code.
    -Commented out "Display User-Submitted Jokes" for the meantime because it the filters weren't working for it.
*/

