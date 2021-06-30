import React from 'react';
import Image from './components/Image.jsx';
import AudioSample from './components/Audio.jsx';
import Title from './components/Title.jsx';
import Info from './components/Info.jsx';

class App extends React.Component {
  constructor(props) {
   super();
   this.state = {
   }
  }

  getBook() {
    const query = new URLSearchParams(location.search);
    const id = query.get('bookId');
    fetch(`http://127.0.0.1:2002/api/book/${id}`)
      .then((response) => {
        return response.json()
      })
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
      <div className='title-service-container'>
        <div className='background-container'>
          <div className='background-image' style={backgroundStyle}></div>
        </div>

          <div className='content-container'>
            <div className='image-sample'>
            <Image url={this.state.currentBook.imageUrl}/>
            <AudioSample audioUrl={this.state.currentBook.audioSampleUrl}/>
            </div>
            <div className='title-info'>
            <Title book={this.state.currentBook}/>
            <Info book={this.state.currentBook}/>
            </div>
            <div className='price-service' id="price-service">
            </div>
          </div>
        </div>
      );
    }
    //return nothing if a book is not retrieved
    return null
  }
}

export default App;