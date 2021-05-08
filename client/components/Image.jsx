import React from 'react';

class Image extends React.Component {
  constructor(props) {
   super(props);
  }

  render() {
    return (
      <div className='image'>
        <img height='250px' width='100%' src={this.props.url}></img>
      </div>
    );
  }
}

export default Image;