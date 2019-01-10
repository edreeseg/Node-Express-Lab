import React from 'react';
import styled from 'styled-components';

const PostInstance = styled.div`
    width: 100%;
    border: 1px solid black;
    margin-bottom: 10px;
    padding: 15px;
`;


export default props => (
    <PostInstance>
        <p><span>ID:</span> {props.data.id}</p>
        <p><span>Title:</span> {props.data.title}</p>
        <p><span>Contents:</span> {props.data.contents}</p>
    </PostInstance>
);