import React from 'react';

class Info extends React.Component {
  constructor(props) {
   super(props);
  }

  render() {
    return (
      <div className='image'>
        <ul>
       <li>By: <span>{this.props.book.author}</span></li>
       <li>Narrated By: <span>{this.props.book.narrator}</span></li>
       <li>Narrated By: <span>{this.props.book.narrator}</span></li>
       <li>Length: {this.props.book.length}</li>
       <li>{this.props.book.version}</li>
       <li>Categories: {
         this.props.book.categories.map((category, i) => {
           if (i === this.props.book.categories.length - 1) {
             return (<span>{category.name}</span>)
           }
           return (<span>{category.name}, </span>)
         })
         }</li>
        </ul>
      </div>
    );
  }
}

export default Info;