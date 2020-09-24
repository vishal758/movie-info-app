import React, { useEffect, useState, useRef } from 'react'
import { Typography, Row } from 'antd';
import { API_URL, API_KEY, IMAGE_URL } from '../../Config'
import GridCard from '../Common/GridCard'
import { withRouter, Redirect } from 'react-router-dom';
import { Input, Button } from 'antd';
import MainImage from '../Common/MainImage'
const { Title } = Typography;
const { Search } = Input;
function SearchSpecific(props) {
    const buttonRef = useRef(null);

    const [Movies, setMovies] = useState([])
    const [Series, setSeries] = useState([])
    const [Loading, setLoading] = useState(true)
    const [filterValue, setFilterValue] = useState(null)

    const [CurrentPage, setCurrentPage] = useState(0)
    const [MainMovieImage, setMainMovieImage] = useState(null)
    const [IsResetClicked, setIsResetClicked] = useState(false)
    
    let type = null
    let value = filterValue !== null ? filterValue : props.location.state.searchValue
    
    console.log("search component props", props)
    if(props.location.state.type === 'movie') {
        type = 'movie'
    } else {
        type = 'tv'
    }

    useEffect(() => {
        const endpoint = `${API_URL}search/${type}?api_key=${API_KEY}&query=${value}&language=en-US&page=1`;
        setMovies([])
        fetchMovies(endpoint)
    }, [value]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
    }, [])

    const fetchMovies = (endpoint) => {

        fetch(endpoint)
            .then(result => result.json())
            .then(result => {
                console.log("recommended", result)
                if(type === 'movie')
                    setMovies([...Movies, ...result.results])
                else 
                    setSeries([...Series, ...result.results])
                setMainMovieImage(MainMovieImage || result.results[0])    
                setCurrentPage(result.page)
            }, setLoading(false))
            .catch(error => console.error('Error:', error)
            )
    }

    const loadMoreItems = () => {
        let endpoint = '';
        setLoading(true)
        console.log('CurrentPage', CurrentPage)
        endpoint = `${API_URL}search/${type}?api_key=${API_KEY}&query=${value}&language=en-US&page=${CurrentPage + 1}`;
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

    const resetFetchMovies = () => {
        setMovies([])
        setSeries([])
        setMainMovieImage(null)
        setFilterValue(null)
        setIsResetClicked(true)
    }

    const fetchFilterMovieList = (value) => {
        setMainMovieImage(null)
        setMovies([])
        setSeries([])
        setFilterValue(value)
        const endpoint = `${API_URL}search/${type}?api_key=${API_KEY}&query=${value}&language=en-US&page=1`;
        fetchMovies(endpoint)
    }

    let recommendedResult = null
    
    if (type === 'movie') {
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
    } else {
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

    let RenderSearch = null

    if(filterValue !== null && filterValue !== '') {
        RenderSearch = <Redirect to={{
                                pathname: "/search",
                                state: {searchValue: value, type: type}
                            }}
                        />
    } else {
        if(IsResetClicked)
            {
                if(type === 'movie')
                    RenderSearch = <Redirect to="/" />
                else 
                RenderSearch = <Redirect to="/tv/sortBy/popular" />

            }
    }

    return (
        <>
            {RenderSearch}
            <div style={{ width: '100%', margin: '0' }}>

            <br />
            <div style={{width: '85%', margin: '1rem auto', display: 'flex', flexDirection: 'column' }}>
                <Search
                    disabled = {value === '' && value === null}
                    placeholder="Search Movie"
                    enterButton="Search"
                    size="defualt"
                    onSearch={value => fetchFilterMovieList(value)}
                /> 
                <br />  
                <Button 
                    style={{width: '30%', margin: '0 auto', justifyContent: 'center', alignItems: 'center'}} 
                    type="primary"
                    onClick={resetFetchMovies}
                    >
                    Clear Filter
                </Button>           
            </div>

            <br />

            {MainMovieImage &&
                <MainImage
                    image={`${IMAGE_URL}w1280${MainMovieImage.backdrop_path}`}
                    title={type === 'movie' ? MainMovieImage.original_title : MainMovieImage.original_name}
                    text={MainMovieImage.overview}
                />

            }

            <div style={{ width: '85%', margin: '1rem auto' }}>

                <Title level={2} > {type === 'movie' ? 'Movies' : 'TV Shows'} </Title>
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
        </>

        
    )
}

export default withRouter(SearchSpecific)
