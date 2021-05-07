import React from 'react';
import Image from './Components/Image.jsx';
import Audio from './Components/Audio.jsx';
import Title from './Components/Title.jsx';
import Info from './Components/Info.jsx';

class App extends React.Component {
  constructor(props) {
   super();
   this.state = {
     currentBook: {
      title: "",
      subtitle: "",
      author: "",
      narrator: "",
      imageUrl: "",
      audioSampleUrl: "",
      length: "",
      version: "",
      categories: [
        { name: "" },
        { name: "" }
      ]
    }
   }
  }

  getBook() {
    const query = new URLSearchParams(location.search);
    const id = query.get('id');
    fetch(`http://localhost:2002/api/book/${id}`)
      .then((response) => response.json())
      .then(data => {
        this.setState({currentBook: data});
      })
  }

  componentDidMount() {
    this.getBook();
  }

  render() {
    return (
      <div className='container'>
        <Image url={this.state.currentBook.imageUrl}/>
        <Audio url={this.state.currentBook.audioSampleUrl}/>
        <Title book={this.state.currentBook}/>
        <Info book={this.state.currentBook}/>
      </div>
    );
  }
}

export default App;