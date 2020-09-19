import React from 'react'
import { Descriptions } from 'antd';

function TvInfo(props) {

    const { serie } = props;
    
    return (
        <Descriptions title="Serie Information" bordered>
        <Descriptions.Item label="Title">{serie.original_name}</Descriptions.Item>
        <Descriptions.Item label="release_date">{serie.first_air_date}</Descriptions.Item>
        <Descriptions.Item label="runtime">{serie.episode_run_time}</Descriptions.Item>
        <Descriptions.Item label="vote_average" span={2}>
        {serie.vote_average}
        </Descriptions.Item>
        <Descriptions.Item label="vote_count">{serie.vote_count}</Descriptions.Item>
        <Descriptions.Item label="status">{serie.status}</Descriptions.Item>
        <Descriptions.Item label="popularity">{serie.popularity}</Descriptions.Item>
      </Descriptions>
    )
}

export default TvInfo
