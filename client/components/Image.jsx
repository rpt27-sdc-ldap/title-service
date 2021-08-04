import React from 'react';

class Image extends React.Component {
  constructor(props) {
   super(props);
  }

  render() {
    console.log(this.props)
    return (
      <div className='image'>
        <img height='100%' width='100%' src={this.props.url}></img>
      </div>
    );
  }
}

export default Image;