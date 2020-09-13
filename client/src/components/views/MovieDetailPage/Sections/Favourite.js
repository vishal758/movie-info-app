import React, {useEffect, useState} from 'react'
import { Button } from 'antd'
import axios from 'axios'

function Favourite(props) {

    const [FavouriteNumber, setFavouriteNumber] = useState(0)
    const [Favourited, setFavourited] = useState(false)
    const variable = {
        userFrom: props.userFrom,
        movieId: props.movieId,
        movieTitle: props.movieInfo.original_title,
        movieImage: props.movieInfo.backdrop_path,
        movieRunTime: props.movieInfo.runtime
    }

    useEffect(() => {
        
        axios.post('/api/favourite/favouriteNumber', variable)
            .then(response => {
                if(response.data.success) {
                    setFavouriteNumber(response.data.favouriteNumber)
                } else {
                    alert("Failed to get favouriteNumber")
                }
            })

        axios.post('/api/favourite/favourited', variable) 
            .then(response => {
                if(response.data.success) {
                    setFavourited(response.data.favourited)
                } else {
                    alert('Failed to get Favourite Info.')
                }
            } )
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const onClickFavourite = () => {
        if(Favourited) {
            axios.post('/api/favourite/removeFromFavourite', variable)
                .then(response => {
                    if(response.data.success) {
                        setFavouriteNumber(FavouriteNumber - 1)
                        setFavourited(!Favourited)
                    } else {
                        alert('Failed to remove from Favourites')
                    }
                })
        } else {
            axios.post('/api/favourite/addToFavourite', variable)
                .then(response => {
                    if(response.data.success) {
                        setFavouriteNumber(FavouriteNumber + 1)
                        setFavourited(!Favourited)
                    } else {
                        alert('Failed to add to Favourites')
                    }
                })
        }
    }

    return (
        <div>
            <Button onClick={onClickFavourite}>{Favourited ? " Remove from Favourite " : " Add to Favourite "} {FavouriteNumber}</Button>
        </div>
    )
}

export default Favourite
