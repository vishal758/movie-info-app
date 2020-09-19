import React, { useEffect, useState } from 'react'
import { Row, Button } from 'antd';
import axios from 'axios';

import Comments from '../../MovieDetailPage/Sections/Comments'
import LikeDislikes from '../../Common/LikeDislikes';
import { API_URL, API_KEY, IMAGE_URL } from '../../../Config'
import GridCards from '../../Common/GridCard';
import MainImage from '../../Common/MainImage';
import TvInfo from './TvInfo';
import Favorite from '../../Common/Favourite';
import Recommendation from '../../Recommendations/Recommendation';
function TvDetailPage(props) {

    const serieId = props.match.params.serieId
    const [Serie, setSerie] = useState([])
    const [Casts, setCasts] = useState([])
    const [CommentLists, setCommentLists] = useState([])
    const [LoadingForSerie, setLoadingForSerie] = useState(true)
    const [LoadingForCasts, setLoadingForCasts] = useState(true)
    const [ActorToggle, setActorToggle] = useState(false)
    const serieVariable = {
        movieId: serieId
    }

    useEffect(() => {

        let endpointForSerieInfo = `${API_URL}tv/${serieId}?api_key=${API_KEY}&language=en-US`;
        fetchDetailInfo(endpointForSerieInfo)

        axios.post('/api/comment/getComments', serieVariable)
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
                setSerie(result)
                setLoadingForSerie(false)

                let endpointForCasts = `${API_URL}tv/${serieId}/credits?api_key=${API_KEY}`;
                fetch(endpointForCasts)
                    .then(result => result.json())
                    .then(result => {
                        console.log(result)
                        setCasts(result.cast)
                    })

                setLoadingForCasts(false)
            })
            .catch(error => console.error('Error:', error)
            )
    }

    const updateComment = (newComment) => {
        setCommentLists(CommentLists.concat(newComment))
    }

    return (
        <div>
            {!LoadingForSerie ?
                <MainImage
                    image={`${IMAGE_URL}w1280${Serie.backdrop_path}`}
                    title={Serie.name}
                    text={Serie.overview}
                />
                :
                <div>loading...</div>
            }

            <div style={{ width: '85%', margin: '1rem auto' }}>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Favorite serie serieInfo={Serie} serieId={serieId} userFrom={localStorage.getItem('userId')} />
                </div>


                {!LoadingForSerie ?
                    <TvInfo serie={Serie} />
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
                    <LikeDislikes serie serieId={serieId} userId={localStorage.getItem('userId')} />
                </div>

                <br />
                    <Recommendation serie serieId = {serieId} />
                <br />
                <Comments movieTitle={Serie.original_name} CommentLists={CommentLists} movieId={serieId} refreshFunction={updateComment} />

            </div>

        </div>
    )
}

export default TvDetailPage

