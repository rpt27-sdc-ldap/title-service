import React from 'react';

class Image extends React.Component {
  constructor(props) {
   super(props);
  }

  render() {
    return (
      <div className='image'>
        <img src={this.props.url}></img>
      </div>
    );
  }
}

export default Image;