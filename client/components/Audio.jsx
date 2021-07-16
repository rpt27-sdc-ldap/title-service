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
    if (!this.state.played) {
      //load the audio on click - callback waits for state to update
      this.setState({loading: true, audio: new Audio(this.props.audioUrl)},
      () => {
        this.state.audio.play()
          .then(() => {
              //set the time to length of audio (MM:SS) - prevents empty string from displaying
              this.setState({time: new Date((this.state.audio.duration) * 1000).toISOString().substr(14, 5)});
              //wait 0.5 second to prevent jumpy loading animation
              setTimeout(() => {
                this.audioTimeCount();
                this.setState({playing: true, played: true, loading: false});
              }, 500)
            })
          .catch(err => {
            console.error(err);
          });
      })
    } else {
      this.state.audio.play()
      .then(() => {
        this.setState({playing: true});
      })
    }
  }

  audioTimeCount() {
    setInterval(() => {
      //converts seconds into MM:SS
      this.setState({time: new Date((this.state.audio.duration - this.state.audio.currentTime) * 1000).toISOString().substr(14, 5)});
      if (this.state.time === '00:00'){
        this.setState({playing: false, played: false, loading: false})
      }
     }, 1000);
  }

  pauseAudioSample() {
    this.setState({playing: false});
    this.state.audio.pause();
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
        <img src="https://hr-rpt-audible.s3-us-west-1.amazonaws.com/pause_04.png" width='16px' height='16px'></img> <span>{this.state.time}</span>
        </button>
      </div>
      )
    }
    if (this.state.played) {
      return (
        <div className='audioSample'>
        <button onClick={this.playAudioSample}>
        <img src="https://hr-rpt-audible.s3-us-west-1.amazonaws.com/play_04.png" width='16px' height='16px'></img> <span>{this.state.time}</span>
        </button>
      </div>
      )
    }
    return (
      <div className='audioSample'>
      <button onClick={this.playAudioSample}>
      <img src="https://hr-rpt-audible.s3-us-west-1.amazonaws.com/play_04.png" width='16px' height='16px'></img> <span>Sample</span>
      </button>
    </div>
    )
  }
}

export default AudioSample;