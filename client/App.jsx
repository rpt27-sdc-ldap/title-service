import React from 'react';
import Image from './Components/Image.jsx';
import Audio from './Components/Audio.jsx';
import Title from './Components/Title.jsx';
import Info from './Components/Info.jsx';

class App extends React.Component {
  constructor(props) {
   super();
   this.state = {
     currentBook: {}
   }
  }

  render() {
    return (
      <div className='container'>
        <Image url={this.state.currentBook.audioUrl}/>
        <Audio url={this.state.currentBook.audioUrl}/>
        <Title book={this.state.currentBook}/>
        <Info book={this.state.currentBook}/>
      </div>
    );
  }
}

export default App;