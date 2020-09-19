import React, { useEffect, useState, useRef } from 'react'
import { Typography, Row } from 'antd';
import { API_URL, API_KEY, IMAGE_URL } from '../../Config'
import MainImage from '../Common/MainImage'
import GridCard from '../Common/GridCard'
import { withRouter } from 'react-router-dom';
const { Title } = Typography;
function LandingPage(props) {
    const buttonRef = useRef(null);

    const [Movies, setMovies] = useState([])
    const [MainMovieImage, setMainMovieImage] = useState(null)
    const [Loading, setLoading] = useState(true)
    let [sortBy, setSortBy] = useState('top_rated')
    const [CurrentPage, setCurrentPage] = useState(0)
    // let sortBy = "top_rated"

    const sortMovieBy = () => {

        if(Object.keys(props.match.params).length !== 0) {
            sortBy = props.match.params.type
            setSortBy(sortBy)
        }
        return sortBy
    }

    useEffect(() => {
        const sortBy = sortMovieBy()
        const endpoint = `${API_URL}movie/${sortBy}?api_key=${API_KEY}&language=en-US&page=1`;
        fetchMovies(endpoint)
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const fetchMovies = (endpoint) => {

        fetch(endpoint)
            .then(result => result.json())
            .then(result => {
                setMovies([...Movies, ...result.results])
                setMainMovieImage(MainMovieImage || result.results[0])
                setCurrentPage(result.page)
            }, setLoading(false))
            .catch(error => console.error('Error:', error)
            )
    }

    const loadMoreItems = () => {
        let endpoint = '';
        setLoading(true)
        const sortBy = sortMovieBy()
        console.log('CurrentPage', CurrentPage)
        endpoint = `${API_URL}movie/${sortBy}?api_key=${API_KEY}&language=en-US&page=${CurrentPage + 1}`;
        fetchMovies(endpoint);

    }

    const handleScroll = () => {
        const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
        const body = document.body;
        const html = document.documentElement;
        const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        const windowBottom = windowHeight + window.pageYOffset;
        if (windowBottom >= docHeight - 1) {

            // loadMoreItems()
            console.log('clicked')
            buttonRef.current.click();

        }
    }

    return (
        <div style={{ width: '100%', margin: '0' }}>
            {MainMovieImage &&
                <MainImage
                    image={`${IMAGE_URL}w1280${MainMovieImage.backdrop_path}`}
                    title={MainMovieImage.original_title}
                    text={MainMovieImage.overview}
                />

            }

            <div style={{ width: '85%', margin: '1rem auto' }}>

                <Title level={2} > Movies by {sortBy} </Title>
                <hr />
                <Row gutter={[16, 16]}>
                    {Movies && Movies.map((movie, index) => (
                        <React.Fragment key={index}>
                            <GridCard
                                movie
                                image={movie.poster_path ?
                                    `${IMAGE_URL}w500${movie.poster_path}`
                                    : null}
                                movieId={movie.id}
                                movieName={movie.original_title}
                            />
                        </React.Fragment>
                    ))}
                </Row>

                {Loading &&
                    <div>Loading...</div>}

                <br />
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button ref={buttonRef} className="loadMore" onClick={loadMoreItems}>Load More</button>
                </div>
            </div>

        </div>
    )
}

export default withRouter(LandingPage)
