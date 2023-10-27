import React, { useState, useEffect } from 'react';
import { getDatabase, set, get, update, remove, ref, child } from "firebase/database";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebase-config';


export const Main = () => {
    const [age, setAge] = useState(""); 
    const [showYoungerJokes, setShowYoungerJokes] = useState(false); 
    const [showOlderJokes, setShowOlderJokes] = useState(false); 
    const [userJoke, setUserJoke] = useState("");
    const [userJokeImage, setUserJokeImage] = useState(null); 
    const [userJokes, setUserJokes] = useState([]); 
    const [jokeId, setJokeId] = useState(0);
    const [sortMethod, setSortMethod] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);
    const jokesPerPage = 10; // Number of jokes to display per page
    const navigate = useNavigate();

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

    const handleUserJokeImageChange = (event) => {
        setUserJokeImage(event.target.files[0]);
    }

    const signOutAndNavigate = async () => {
        try {
            // Sign out the user from Firebase
            await signOut(auth);
            localStorage.removeItem("auth"); // Remove user data from local storage
            navigate("/"); // Navigate to the auth page
        } catch (error) {
            console.error("Error signing out:", error);
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
                age: "+18",
                date: new Date().toISOString(),
            };
            setUserJokes([...userJokes, newJoke]);
            setUserJoke("");
            setUserJokeImage(null);

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
                age: "<18",
                date: new Date().toISOString(),
            };
            setUserJokes([...userJokes, newJoke]);
            setUserJoke("");
            setUserJokeImage(null);

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
            setUserJokes([...userJokes, { joke: userJoke, image: userJokeImage, rating: null, age: age, date: new Date() }]);
            setUserJoke(""); 
            setUserJokeImage(null);
        }
    }

    // Function to handle rating of a user-submitted joke
    const rateUserJoke = (index, rating) => {
        const jokeRef = ref(db, `Jokes/${age}/${jokeId}/rating`);

        get(jokeRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const currentRating = snapshot.val() || 0;

                    const newRating = currentRating + rating;
                    set(jokeRef, newRating)
                        .then(() => {
                            const updatedUserJokes = [...userJokes];
                            updatedUserJokes[jokeId].rating = newRating;
                            setUserJokes(updatedUserJokes);
                        })
                        .catch((error) => {
                            console.error("Error updating rating in Firebase: ", error);
                        })
                }
            })
        const updatedUserJokes = [...userJokes];
        updatedUserJokes[index].rating = rating;
        setUserJokes(updatedUserJokes);
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
                    <input type="file" accept=".jpg, .jpeg, .png, .gif" onChange={handleUserJokeImageChange} />
                    <button type="button" onClick={handleSubmit}>Submit Joke</button>
                </div>
            )}

            <div>
                <button onClick={signOutAndNavigate}>Sign Out</button>
            </div>
        </div>
    );
}