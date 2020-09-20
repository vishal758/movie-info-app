import React, { useEffect, useState, useRef } from 'react'
import { Typography, Row } from 'antd';
import { API_URL, API_KEY, IMAGE_URL } from '../../Config'
import GridCard from '../Common/GridCard'
import { withRouter } from 'react-router-dom';
const { Title } = Typography;
function Recommendation(props) {
    const buttonRef = useRef(null);

    const [Movies, setMovies] = useState([])
    const [Series, setSeries] = useState([])
    const [Loading, setLoading] = useState(true)
    const [CurrentPage, setCurrentPage] = useState(0)
    let movieId = null, serieId = null
    let variable = null
    if(props.movie) {
        movieId = props.movieId
        variable = {
            name: 'movie',
            id: movieId
        }
    } else if(props.serie) {
        serieId = props.serieId
        variable = {
            name: 'tv',
            id: serieId
        }
    }
    console.log("variable", variable)

    useEffect(() => {
        // const endpoint = `${API_URL}movie/${movieId}/recommendations?api_key=${API_KEY}&language=en-US&page=1`;
        const endpoint = `${API_URL}${variable.name}/${variable.id}/recommendations?api_key=${API_KEY}&language=en-US&page=1`;
        fetchMovies(endpoint)
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
    }, [])

    const fetchMovies = (endpoint) => {

        fetch(endpoint)
            .then(result => result.json())
            .then(result => {
                console.log("recommended", result)
                if(props.movie)
                    setMovies([...Movies, ...result.results])
                else if(props.serie)
                    setSeries([...Series, ...result.results])
                setCurrentPage(result.page)
            }, setLoading(false))
            .catch(error => console.error('Error:', error)
            )
    }

    const loadMoreItems = () => {
        let endpoint = '';
        setLoading(true)
        console.log('CurrentPage', CurrentPage)
        // endpoint = `${API_URL}movie/${movieId}/recommendations?api_key=${API_KEY}&language=en-US&page=${CurrentPage + 1}`;
        endpoint = `${API_URL}${variable.name}/${variable.id}/recommendations?api_key=${API_KEY}&language=en-US&page=${CurrentPage + 1}`;
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
            if(buttonRef.current !== null)
                buttonRef.current.click();

        }
    }
    let recommendedResult = null
    if (props.movie) {
        recommendedResult = Movies && Movies.map((movie, index) => (
            <React.Fragment key={index}>
                {movie.poster_path && <GridCard
                    movie
                    image={movie.poster_path ?
                        `${IMAGE_URL}w500${movie.poster_path}`
                        : null}
                    movieId={movie.id}
                    movieName={movie.original_title}
                />}
            </React.Fragment>
        ))
    } else if (props.serie) {
        recommendedResult = Series && Series.map((serie, index) => (
            <React.Fragment key={index}>
                {serie.poster_path && <GridCard
                    serie
                    image={serie.poster_path ?
                        `${IMAGE_URL}w500${serie.poster_path}`
                        : null}
                    serieId={serie.id}
                    serieName={serie.original_name}
                />}
            </React.Fragment>
        ))
    }

    return (
        <div style={{ width: '100%', margin: '0' }}>

            <div style={{ width: '85%', margin: '1rem auto' }}>

                <Title level={2} > Recommended {props.movie ? 'Movies' : 'TV Shows'} </Title>
                <hr />
                <Row gutter={[16, 16]}>
                    {recommendedResult}
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

export default withRouter(Recommendation)
