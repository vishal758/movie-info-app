import React from 'react'
import { Col } from 'antd'
import {Typography} from 'antd'
const { Title} = Typography
function GridCard(props) {

    if(props.actor) {
        return (
            
            <Col lg={6} md={8} xs={24}>
                <div style={{position: 'relative'}}>
                        <img style={{width: '100%', height: '320px'}} alt="" src={props.image} />
                        <div style= {{ position: 'absolute', maxWidth: '400px', bottom: '1rem', marginLeft: '2rem' }}>
                            <Title style = {{color: 'white'}} level={3}>{props.name}</Title>
                            <p style={{color: 'white', fontSize: '1rem'}}>{props.character}</p>
                        </div>
                </div>  
            </Col>
        ) 
    } else {
        return (
            <Col lg={6} md={8} xs={24}>
                <div style={{position: 'relative'}}>
                    <a href={`/movie/${props.movieId}`}>
                        <img style={{width: '100%', height: '320px'}} alt="img" src={props.image} />
                    </a> 
                </div>  
            </Col>
        )
    }
}

export default GridCard
