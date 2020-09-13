import React, {useEffect, useState} from 'react'
import './FavouritePage.css'
import axios from 'axios'
import {Popover} from 'antd'
import { IMAGE_URL } from '../../Config'


function FavouritePage() {

    const variable = {
        userFrom: localStorage.getItem('userId')
    }
    const [FavouriteMovies, setFavouriteMovies] = useState([])
    useEffect(() => {
        fetchFavouritedMovies()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const fetchFavouritedMovies = () => {
        axios.post('api/favourite/getFavouritedMovie', variable)
            .then(response => {
                if(response.data.success) {
                    setFavouriteMovies(response.data.favourites)
                } else {
                    alert('Failed to get Favourite Movies.')
                }
            })
    }

    const onClickRemove = (movieId) => {

        const variable = {
            movieId: movieId,
            userFrom: localStorage.getItem('userId')
        }
        axios.post('/api/favourite/removeFromFavourite', variable)
                .then(response => {
                    if(response.data.success) {
                        fetchFavouritedMovies()
                    } else {
                        alert('Failed to remove from Favourites')
                    }
                })
    }

    let renderTableBody = FavouriteMovies.map((movie, index) => {
        const content = (
            <div>
                {movie.movieImage ? 
                    <img src={`${IMAGE_URL}w500${movie.movieImage}`} alt="movieImage" /> 
                    : null
                }
            </div>
        )
        return <tr>
            <Popover content={content} title={`${movie.movieTitle}`}>
                <td>{movie.movieTitle}</td>
            </Popover>
            <td>{movie.movieRunTime}</td>
            <td><button onClick={() => onClickRemove(movie.movieId)}>Remove</button></td>
        </tr>
    })
    return (
        <div style={{width: '85%', margin: '3rem auto'}}>
            <h3>Favourite Movies By Me</h3>
            <hr />
            <table>
                <thead>
                    <tr>
                        <th>Movie Title</th>
                        <th>Movie Runtime</th>
                        <th>Remove From Favourite</th>
                    </tr>
                </thead>
                <tbody>
                    {renderTableBody}
                </tbody>
            </table>
        </div>
    )
}

export default FavouritePage