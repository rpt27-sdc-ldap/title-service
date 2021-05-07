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
      title: "A Promised Land",
      subtitle: "",
      author: "Barack Obama",
      narrator: "Barack Obama",
      imageUrl: "https://hr-rpt-audible.s3-us-west-1.amazonaws.com/001-a-promised-land.jpg",
      audioSampleUrl: "https://hr-rpt-audible.s3-us-west-1.amazonaws.com/001-a-promised-land.mp3",
      length: "29:10",
      version: "",
      categories: [
        { name: "Biographies & Memoirs" },
        { name: "Politics & Activism" }
      ]
    }
   }
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