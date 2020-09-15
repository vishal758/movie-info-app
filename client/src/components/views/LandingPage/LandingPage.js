import React, { useEffect, useState } from 'react'
import { API_KEY, API_URL, IMAGE_URL } from '../../Config'
import { Typography, Row, Modal } from 'antd'
import MainImage from './Sections/MainImage';
import GridCard from './Sections/GridCard'
import { withRouter } from 'react-router-dom';
const { Title } = Typography

function LandingPage(props) {

    const [Movies, setMovies] = useState([])
    const [currentPage, setCurrentPage] = useState(0)

    const fetchType = () => {
        let fetchByTypeId = props.fetchTypeId
        if(Object.keys(props.match.params).length !== 0) {
            fetchByTypeId = props.match.params.type
        }
        return fetchByTypeId
     }

    useEffect(() => {
        const fetchByTypeId = fetchType()
        const endPoint = `${API_URL}movie/${fetchByTypeId}?api_key=${API_KEY}&language=en-US&page=1`
        fetchMovies(endPoint)
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const fetchMovies = (path) => {
        
        fetch(path)
            .then(response => response.json())
            .then(response => {
                console.log(response)
                setMovies([...Movies, ...response.results])
                setCurrentPage(response.page)
            })
            .catch(err => {
                console.log(err)
            })
    }
    const handleClick = () => {
        const fetchByTypeId = fetchType()
        const endPoint = `${API_URL}movie/${fetchByTypeId}?api_key=${API_KEY}&language=en-US&page=${currentPage + 1}`
        fetchMovies(endPoint)
    }
    return (
        <div style={{width: '100%', margin: 0}}>
            {
                Movies[0] && 
                    <MainImage 
                        image={`${IMAGE_URL}/w1280${Movies[0].backdrop_path && Movies[0].backdrop_path}`} 
                        title={Movies[0].original_title} 
                        text={Movies[0].overview} 
                    />
            }
            
                    <div style={{width: '85%', margin: '1rem auto'}}>
                    <Title level={2}>Movies By {props.match.params.type ? props.match.params.type : props.fetchTypeId}</Title>
                    <hr />

                    <Row gutter={[16,16]}>
                        {Movies && Movies.map((movie, index) => (
                            <React.Fragment key={index}>
                                <GridCard 
                                    image={movie.poster_path && `${IMAGE_URL}w500${movie.poster_path}`}
                                    movieId={movie.id}
                                    />
                            </React.Fragment>
                        ))}
                    </Row>

                    <br />
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <button onClick={handleClick}> Load More</button>
                    </div>
                    </div>
        </div>
    )
}

export default withRouter(LandingPage) 
