import React from 'react';
import Rating from './Rating.jsx'

class Info extends React.Component {
  constructor(props) {
   super(props);
  }

  render() {
    return (
      <div className='info'>
        <ul>
       <li>By: <a href="#">{this.props.book.author}</a></li>
       <li>Narrated By: <a href="#">{this.props.book.narrator}</a></li>
       <li>Length: {this.props.book.length.split(':')[0]} hrs and {this.props.book.length.split(':')[1]} mins</li>
       <li>{this.props.book.version}</li>
       <li>Categories: {
         this.props.book.categories.map((category, i) => {
           //dont add a comma on the last category
           if (i === this.props.book.categories.length - 1) {
             return (<a key={i} href="#">{category.name}</a>)
           }
           return (<span key={i}><a href="#">{category.name}</a>, </span>)
         })
         }</li>
        </ul>
        <Rating />
      </div>
    );
  }
}

export default Info;