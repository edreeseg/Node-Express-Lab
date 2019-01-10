import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import './App.css';
import Post from './components/Post';

const PostThread = styled.section`
  width: 80%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  margin-top: 50px;
`;

class App extends Component {
  state = {
    posts: [],
  };
  componentDidMount(){
    axios('http://localhost:5000/api/posts')
      .then(res => this.setState({ posts: res.data.posts }))
      .catch(err => console.log(err));
  }
  render() {
    return (
      <PostThread>
        {this.state.posts.map(post => <Post key={post.id} data={post} />)}
      </PostThread>
    );
  }
}

export default App;
