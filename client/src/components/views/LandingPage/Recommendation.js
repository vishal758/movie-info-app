import React, { useEffect, useState } from 'react'
import { API_KEY, API_URL, IMAGE_URL } from '../../Config'
import { Typography, Row } from 'antd'
import GridCard from './Sections/GridCard'
import { withRouter } from 'react-router-dom';
const { Title } = Typography

function Recommendation(props) {

    const [Movies, setMovies] = useState([])
    const [currentPage, setCurrentPage] = useState(0)

    useEffect(() => {
        const endPoint = `${API_URL}movie/${props.movieId}/recommendations?api_key=${API_KEY}&language=en-US&page=1`
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
        const endPoint = `${API_URL}movie/${props.movieId}/recommendations?api_key=${API_KEY}&language=en-US&page=${currentPage + 1}`
        fetchMovies(endPoint)
    }
    return (
        <div style={{width: '100%', margin: 0}}>
                
            <div style={{width: '85%', margin: '1rem auto'}}>
            <Title level={2}>Recommended Movies</Title>
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

export default withRouter(Recommendation) 
