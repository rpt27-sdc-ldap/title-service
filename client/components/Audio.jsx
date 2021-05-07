import React from 'react';

class Audio extends React.Component {
  constructor(props) {
   super(props);
  }

  render() {
    return (
      <div className='audio'>
        <img src="https://hr-rpt-audible.s3-us-west-1.amazonaws.com/play.png"></img> Play Sample
      </div>
    );
  }
}

export default Audio;