import React from 'react';

class Rating extends React.Component {
  constructor(props) {
   super(props);
   this.state = {
   };

  this.randomlyGenerateStats = this.randomlyGenerateStats.bind(this);
  }

  randomNumberGenerator(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }


  randomlyGenerateStats() {
    //set number of reviews
    const numberOfReviews = this.randomNumberGenerator(20, 20000)
    //set number of stars
    let stars = this.randomNumberGenerator(0, 5);
    //set the .5 or not
    if (stars < 5) {
      if(this.randomNumberGenerator(0, 1) === 1) {
        stars += .5;
      }
    }
    return {numberOfReviews, stars};
  }

  componentDidMount(){
    this.setState(this.randomlyGenerateStats());
  }

  render() {
    return (
      <div className='rating'>
        stars: {this.state.stars} number: {this.state.numberOfReviews}
      </div>
    );
  }
}

export default Rating;