import React, { useEffect, useState, useRef } from 'react'
import { Typography, Row, Input, Button } from 'antd';
import { API_URL, API_KEY, IMAGE_URL } from '../../Config'
import MainImage from '../Common/MainImage'
import GridCard from '../Common/GridCard'
import { withRouter, Redirect } from 'react-router-dom';
const { Title } = Typography;
const { Search } = Input;

function TvLandingPage(props) {
    const buttonRef = useRef(null);

    const [Series, setSeries] = useState([])
    const [MainSerieImage, setMainSerieImage] = useState(null)
    const [Loading, setLoading] = useState(true)
    let [sortBy, setSortBy] = useState('popular')
    const [CurrentPage, setCurrentPage] = useState(0)

    const [filterValue, setFilterValue] = useState(null)
    const [isClickedReset, setIsClickedReset] = useState(false)
    // let sortBy = "top_rated"

    const sortSerieBy = () => {

        if(Object.keys(props.match.params).length !== 0) {
            sortBy = props.match.params.type
            setSortBy(sortBy)
        }
        console.log(sortBy)
        return sortBy
    }

    useEffect(() => {
        const sortBy = sortSerieBy()
        const endpoint = `${API_URL}tv/${sortBy}?api_key=${API_KEY}&language=en-US&page=1`;
        fetchSeries(endpoint)
    }, [isClickedReset]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const fetchSeries = (endpoint) => {

        fetch(endpoint)
            .then(result => result.json())
            .then(result => {
                console.log(result)
                setSeries([...Series, ...result.results])
                setMainSerieImage(MainSerieImage || result.results[0])
                setCurrentPage(result.page)
            }, setLoading(false))
            .catch(error => console.error('Error:', error)
            )
    }

    const loadMoreItems = () => {
        let endpoint = '';
        setLoading(true)
        const sortBy = sortSerieBy()
        console.log('CurrentPage', CurrentPage)
        endpoint = `${API_URL}tv/${sortBy}?api_key=${API_KEY}&language=en-US&page=${CurrentPage + 1}`;
        fetchSeries(endpoint);

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

    const resetFetchSerie = () => {
        setSeries([])
        setMainSerieImage(null)
        setFilterValue(null)
        setIsClickedReset(!isClickedReset)
        const sortBy = sortSerieBy()
        const endpoint = `${API_URL}tv/${sortBy}?api_key=${API_KEY}&language=en-US&page=1`;
        fetchSeries(endpoint)
    }

    const fetchFilterSerieList = (value) => {
        setSeries([])
        setMainSerieImage(null)
        setFilterValue(value)
        const sortBy = sortSerieBy()
        const endpoint = `${API_URL}tv/${sortBy}?api_key=${API_KEY}&language=en-US&page=1`;
        fetchSeries(endpoint)
    }

    let RenderSearch = null

    if(filterValue !== null && filterValue !== '') {
        RenderSearch = <Redirect to={{
                                pathname: "/search",
                                state: {searchValue: filterValue, type: 'tv'}
                            }}
                        />
    }

    return (
        <>
            {RenderSearch}
            <div style={{ width: '100%', margin: '0' }}>
            
                <br />
                <div style={{width: '85%', margin: '1rem auto', display: 'flex', flexDirection: 'column' }}>
                    <Search
                        placeholder="Search Serie"
                        enterButton="Search"
                        size="default"
                        onSearch={value => fetchFilterSerieList(value)}
                    /> 
                    <br />  
                    <Button 
                        style={{width: '30%', margin: '0 auto', justifyContent: 'center', alignItems: 'center'}} 
                        type="primary"
                        onClick={resetFetchSerie}
                        >
                        Clear Filter
                    </Button>           
                </div>
                    
                <br />
                
                {MainSerieImage &&
                    <MainImage
                        image={`${IMAGE_URL}w1280${MainSerieImage.backdrop_path}`}
                        title={MainSerieImage.original_name}
                        text={MainSerieImage.overview}
                    />

                }

                <div style={{ width: '85%', margin: '1rem auto' }}>

                    <Title level={2} > TV Series by {sortBy} </Title>
                    <hr />
                    <Row gutter={[16, 16]}>
                        {Series && Series.map((serie, index) => (
                            <React.Fragment key={index}>
                                <GridCard
                                    serie
                                    image={serie.poster_path ?
                                        `${IMAGE_URL}w500${serie.poster_path}`
                                        : null}
                                    serieId={serie.id}
                                    serieName={serie.original_title}
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
        </>
    )
}

export default withRouter(TvLandingPage)
