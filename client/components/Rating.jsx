import React from 'react';
import StarRatings from 'react-star-ratings';

class Rating extends React.Component {
  constructor(props) {
   super(props);
   this.state = {
   };

  }

  componentDidMount(){
    const bookId = this.props.id
    fetch(`http://ec2-18-220-21-137.us-east-2.compute.amazonaws.com:2880/api/aggReview/${bookId}`)
    .then(data => data.json())
    .then(response => {
      this.setState({rating: response[0].overall});
    })
  }

  render() {
    if (this.state.rating) {
      return (
        <li className="stars">
          <StarRatings rating={this.state.rating.average} starRatedColor='rgb(255,197,54)' starDimension='14px' starSpacing='3px' starEmptyColor='rgba(0,0,0,0)'/> <span className="hide-mobile">{this.state.rating.average} &#40;{this.state.rating.total} ratings&#41;</span>
        </li>
      );
    }
    return null;
  }
}

export default Rating;