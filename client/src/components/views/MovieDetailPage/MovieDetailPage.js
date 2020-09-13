import { Descriptions, Button, Row } from 'antd'
import React, {useEffect, useState} from 'react'
import { API_KEY, API_URL, IMAGE_URL } from '../../Config'
import MainImage from '../LandingPage/Sections/MainImage'
import GridCard from '../LandingPage/Sections/GridCard'
import Favourite from './Sections/Favourite'

function MovieDetailPage(props) {

    const [Movie, setMovie] = useState([])
    const [Crews, setCrews] = useState([])
    const [ActorToggle, setActorToggle] = useState(false)
    const movieId = props.match.params.movieId


    useEffect(() => {

        const url = `${API_URL}movie/${movieId}?api_key=${API_KEY}&language=en-US`
        // console.log(url)
        fetch(url)
            .then(response => response.json())
            .then(response => {
                console.log(response)
                setMovie(response)
                const crewUrl = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`
                fetch(crewUrl)
                    .then(response => response.json())
                    .then(response => {
                        console.log("crew ", response)
                        setCrews(response.cast)
                    })

            }).catch(err => {
                console.log(err)
            })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const handleClick = () => {
        setActorToggle(!ActorToggle)
    }
    return (
        <div>
            {Movie && <MainImage 
            image={`${IMAGE_URL}/w1280${Movie.backdrop_path && Movie.backdrop_path}`} 
            title={Movie.original_title} 
            text={Movie.overview} />}

            <div style={{width: '85%', margin: '1rem auto'}}>
                <div style={{display:'flex', justifyContent: 'flex-end'}}>
                    <Favourite
                        userFrom={localStorage.getItem('userId')}
                        movieId={movieId}
                        movieInfo={Movie}
                        />
                </div>

                <Descriptions title="Movie Info" bordered>
                    <Descriptions.Item label="Title">{Movie.original_title}</Descriptions.Item>
                    <Descriptions.Item label="release_date">{Movie.release_date}</Descriptions.Item>
                    <Descriptions.Item label="revenue">{Movie.revenue}</Descriptions.Item>
                    <Descriptions.Item label="runtime">{Movie.runtime}</Descriptions.Item>
                    <Descriptions.Item label="vote_average" span={2}>
                        {Movie.vote_average}
                    </Descriptions.Item>
                    <Descriptions.Item label="vote_count">{Movie.vote_count}</Descriptions.Item>
                    <Descriptions.Item label="status">{Movie.status}</Descriptions.Item>
                    <Descriptions.Item label="popularity">{Movie.popularity}</Descriptions.Item>
                </Descriptions>
                <br />
                <div style={{display:'flex', justifyContent: 'center'}}>
                    <Button onClick={handleClick}>Toggle Actor View</Button>
                </div>
                <br />
                {ActorToggle && 
                    <Row gutter={[16,16]}>
                        {Crews && Crews.map((crew, index) => (
                            <React.Fragment key={index}>
                                {crew.profile_path && 
                                    <GridCard 
                                    actor
                                    image={`${IMAGE_URL}w500${crew.profile_path}`}
                                    name = {crew.name}
                                    character = {crew.character}
                                    />
                                }
                                
                            </React.Fragment>
                        ))}
                    </Row>
                }
                

            </div>


        </div>
    )
}

export default MovieDetailPage
