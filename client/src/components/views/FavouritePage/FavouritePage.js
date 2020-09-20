import React, {useEffect, useState} from 'react'
import './FavouritePage.css'
import axios from 'axios'
import {Popover} from 'antd'
import { IMAGE_URL } from '../../Config'


function FavouritePage(props) {

    const variableMovie = {
        userFrom: localStorage.getItem('userId'),
        movie: true
    }

    const variableSerie = {
        userFrom: localStorage.getItem('userId'),
        serie: true
    }
    const [FavouriteMovies, setFavouriteMovies] = useState([])
    const [FavouriteSeries, setFavouriteSeries] = useState([])
    useEffect(() => {
        fetchFavouritedMovies()
        fetchFavouritedSeries()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const fetchFavouritedMovies = () => {
        axios.post('api/favourite/getFavouritedMovie', variableMovie)
            .then(response => {
                if(response.data.success) {
                    console.log("favmovies", response.data.favourites)
                    setFavouriteMovies(response.data.favourites)
                } else {
                    alert('Failed to get Favourite Movies.')
                }
            })
    }

    const fetchFavouritedSeries = () => {
        axios.post('api/favourite/getFavouritedMovie', variableSerie)
            .then(response => {
                if(response.data.success) {
                    console.log("favseries", response.data.favourites)

                    setFavouriteSeries(response.data.favourites)
                } else {
                    alert('Failed to get Favourite Series.')
                }
            })
    }

    const onClickRemove = (value, type) => {

        let variable = null
        if(type === 'movie') {
            variable = {
                movieId: value,
                userFrom: localStorage.getItem('userId')
            }
        } else if (type === 'serie') {
            variable = {
                serieId: value,
                userFrom: localStorage.getItem('userId')
            }
        }
        axios.post('/api/favourite/removeFromFavourite', variable)
                .then(response => {
                    if(response.data.success) {
                        fetchFavouritedMovies()
                        fetchFavouritedSeries()
                    } else {
                        alert('Failed to remove from Favourites')
                    }
                })
    }
    const redirectToMovies = (movieId) => {
        props.history.push('/movie/' + movieId)
    }

    const redirectToSeries = (serieId) => {
        props.history.push('/tv/' + serieId)
    }

    let renderTableBodyMovies = FavouriteMovies.map((movie, index) => {
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
                <td style={{cursor: 'pointer'}} onClick={() => redirectToMovies(movie.movieId)}>{movie.movieTitle}</td>
            </Popover>
            <td>{movie.movieRunTime}</td>
            <td><button onClick={() => onClickRemove(movie.movieId, 'movie')}>Remove</button></td>
        </tr>
    })

    let renderTableBodySeries = FavouriteSeries.map((serie, index) => {
        const content = (
            <div>
                {serie.serieImage ? 
                    <img src={`${IMAGE_URL}w500${serie.serieImage}`} alt="serieImage" /> 
                    : null
                }
            </div>
        )
        return <tr>
            <Popover content={content} title={`${serie.serieTitle}`}>
                <td style={{cursor: 'pointer'}} onClick={() => redirectToSeries(serie.serieId)}>{serie.serieTitle}</td>
            </Popover>
            {/* <td>{serie.serieRunTime}</td> */}
            <td><button onClick={() => onClickRemove(serie.serieId, 'serie')}>Remove</button></td>
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
                    {renderTableBodyMovies}
                </tbody>
            </table>
            <br />
            <br />
            <h3>Favourite Series By Me</h3>
            <hr />
            <table>
                <thead>
                    <tr>
                        <th>TV Title</th>
                        {/* <th>TV Runtime</th> */}
                        <th>Remove From Favourite</th>
                    </tr>
                </thead>
                <tbody>
                    {renderTableBodySeries}
                </tbody>
            </table>
        </div>
    )
}

export default FavouritePage