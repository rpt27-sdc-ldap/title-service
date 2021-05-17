import React from 'react';
import Image from './Components/Image.jsx';
import AudioSample from './Components/Audio.jsx';
import Title from './Components/Title.jsx';
import Info from './Components/Info.jsx';

class App extends React.Component {
  constructor(props) {
   super();
   this.state = {
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
    if (this.state.currentBook) {
      const backgroundStyle = {
        backgroundImage: `url('${this.state.currentBook.imageUrl}')`,
        backgroundRepeat: 'no-repeat'
      };
      return (
        <div>
        <div className='background-container'>
          <div className='background-image' style={backgroundStyle}></div>
        </div>

          <div className='content-container'>
            <div className='image-sample'>
            <Image url={this.state.currentBook.imageUrl}/>
            <AudioSample audio={new Audio(this.state.currentBook.audioSampleUrl)}/>
            </div>
            <div className='title-info'>
            <Title book={this.state.currentBook}/>
            <Info book={this.state.currentBook}/>
            </div>
            <div className='price-service'>
            </div>
          </div>
        </div>
      );
    }
    //return nothing if a book is not retrieved
    return null;
  }
}

export default App;