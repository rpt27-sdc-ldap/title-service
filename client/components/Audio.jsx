import React from 'react';

class AudioSample extends React.Component {
  constructor(props) {
   super(props);
   this.state = {
     playing: false,
     played: false,
     loading: false,
     time: ''
   }
   this.playAudioSample = this.playAudioSample.bind(this);
   this.pauseAudioSample = this.pauseAudioSample.bind(this);
   this.audioTimeCount = this.audioTimeCount.bind(this);
  }
  playAudioSample() {
    this.props.audio.play()
      .then(() => {
        //check if loading is needed
        if (!this.state.played) {
          //set the time to length of audio (MM:SS) - prevents empty string from displaying
          this.setState({loading: true, time: new Date((this.props.audio.duration) * 1000).toISOString().substr(14, 5)});
          //wait 0.5 second to prevent jumpy loading animation
          setTimeout(() => {
            this.audioTimeCount();
            this.setState({playing: true, played: true, loading: false});
          }, 500)
        } else {
          this.setState({playing: true});
        }
      })
  }

  audioTimeCount() {
    setInterval(() => {
      //converts seconds into MM:SS
      this.setState({time: new Date((this.props.audio.duration - this.props.audio.currentTime) * 1000).toISOString().substr(14, 5)});
     }, 1000);
  }

  pauseAudioSample() {
    this.setState({playing: false});
    this.props.audio.pause();
  }

  render() {
    if (this.state.loading) {
      return (
      <div className='audioSample'>
        <button>
        <img src="https://hr-rpt-audible.s3-us-west-1.amazonaws.com/loading.gif" width='16px' height='16px'></img>
        </button>
      </div>
      )
    }
    if (this.state.playing) {
      return (
      <div className='audioSample'>
        <button onClick={this.pauseAudioSample}>
        <img src="https://hr-rpt-audible.s3-us-west-1.amazonaws.com/pause.png" width='16px' height='16px'></img> {this.state.time}
        </button>
      </div>
      )
    }
    if (this.state.played) {
      return (
        <div className='audioSample'>
        <button onClick={this.playAudioSample}>
        <img src="https://hr-rpt-audible.s3-us-west-1.amazonaws.com/play.png" width='16px' height='16px'></img> {this.state.time}
        </button>
      </div>
      )
    }
    return (
      <div className='audioSample'>
      <button onClick={this.playAudioSample}>
      <img src="https://hr-rpt-audible.s3-us-west-1.amazonaws.com/play.png" width='16px' height='16px'></img> Sample
      </button>
    </div>
    )
  }
}

export default AudioSample;