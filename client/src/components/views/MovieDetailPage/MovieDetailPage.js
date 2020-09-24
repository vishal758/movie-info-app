import React, { useEffect, useState } from 'react'
import { Row, Button, Typography } from 'antd';
import axios from 'axios';

import Comments from './Sections/Comments'
import LikeDislikes from '../Common/LikeDislikes';
import { API_URL, API_KEY, IMAGE_URL } from '../../Config'
import GridCards from '../Common/GridCard';
import MainImage from '../Common/MainImage';
import MovieInfo from './Sections/MovieInfo';
import Favorite from '../Common/Favourite';
import Recommendation from '../Recommendations/Recommendation';
import { Collapse } from 'antd';

const { Panel } = Collapse;
const { Title } = Typography;

function MovieDetailPage(props) {

    const movieId = props.match.params.movieId
    const [Movie, setMovie] = useState([])
    const [Casts, setCasts] = useState([])
    const [CommentLists, setCommentLists] = useState([])
    const [LoadingForMovie, setLoadingForMovie] = useState(true)
    const [LoadingForCasts, setLoadingForCasts] = useState(true)
    const [ActorToggle, setActorToggle] = useState(false)
    const [MovieReviews, setMovieReviews] = useState([])
    const movieVariable = {
        movieId: movieId
    }

    useEffect(() => {

        let endpointForMovieInfo = `${API_URL}movie/${movieId}?api_key=${API_KEY}&language=en-US`;
        fetchDetailInfo(endpointForMovieInfo)

        axios.post('/api/comment/getComments', movieVariable)
            .then(response => {
                console.log(response)
                if (response.data.success) {
                    console.log('response.data.comments', response.data.comments)
                    setCommentLists(response.data.comments)
                } else {
                    alert('Failed to get comments Info')
                }
            })
        
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const toggleActorView = () => {
        setActorToggle(!ActorToggle)
    }

    const fetchDetailInfo = (endpoint) => {

        fetch(endpoint)
            .then(result => result.json())
            .then(result => {
                console.log(result)
                setMovie(result)
                setLoadingForMovie(false)

                let endpointForCasts = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`;
                fetch(endpointForCasts)
                    .then(result => result.json())
                    .then(result => {
                        console.log(result)
                        setCasts(result.cast)
                    })
                    
                let endPointForReviews = `${API_URL}movie/${movieId}/reviews?api_key=${API_KEY}&language=en-US`
                fetch(endPointForReviews)
                    .then(result => result.json())
                    .then(result => {
                        console.log("reviews", result)
                        setMovieReviews(result.results)
                    })

                setLoadingForCasts(false)
            })
            .catch(error => console.error('Error:', error)
            )
    }

    const updateComment = (newComment) => {
        setCommentLists(CommentLists.concat(newComment))
    }


    let reviews = null
    if(MovieReviews) {
        let newMovieReviews = [...MovieReviews]
        if(MovieReviews.length > 5) {
            newMovieReviews = newMovieReviews.slice(0,5)
        }
        reviews = newMovieReviews.map((review, index) => {
            return (
                <Panel key = {index}
                        header = {review.author}
                    >
                    <p>{review.content}</p>
                </Panel>
            )
        })
    }

    return (
        <div>
            {!LoadingForMovie ?
                <MainImage
                    image={`${IMAGE_URL}w1280${Movie.backdrop_path}`}
                    title={Movie.original_title}
                    text={Movie.overview}
                />
                :
                <div>loading...</div>
            }

            <div style={{ width: '85%', margin: '1rem auto' }}>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Favorite movie movieInfo={Movie} movieId={movieId} userFrom={localStorage.getItem('userId')} />
                </div>


                {!LoadingForMovie ?
                    <MovieInfo movie={Movie} />
                    :
                    <div>loading...</div>
                }

                <br />

                <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem' }}>
                    <Button onClick={toggleActorView}>Toggle Actor View </Button>
                </div>

                {ActorToggle &&
                    <Row gutter={[16, 16]}>
                        {
                            !LoadingForCasts ? Casts.map((cast, index) => (
                                cast.profile_path &&
                                <GridCards key={index} actor image={cast.profile_path} name = {cast.name} character={cast.character} />
                            )) :
                                <div>loading...</div>
                        }
                    </Row>
                }
                <br />

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <LikeDislikes movie movieId={movieId} userId={localStorage.getItem('userId')} />
                </div>

                <br />
                <Title level={2} > Reviews </Title>
                <hr />

                {MovieReviews && 
                <Collapse accordion>
                    {reviews}
                </Collapse>}
                <br />
                    <Recommendation movie movieId = {movieId} />
                <br />
                <Comments movieTitle={Movie.original_title} CommentLists={CommentLists} movieId={movieId} refreshFunction={updateComment} />

            </div>

        </div>
    )
}

export default MovieDetailPage

