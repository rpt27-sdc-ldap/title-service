import React from 'react';

class Title extends React.Component {
  constructor(props) {
   super(props);
  }

  render() {
    return (
      <div className='title'>
        <h1>{this.props.book.title}</h1>
        <h2>{this.props.book.subtitle}</h2>
      </div>
    );
  }
}

export default Title;