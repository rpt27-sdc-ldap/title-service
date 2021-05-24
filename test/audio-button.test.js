import React from 'react';
import { mount } from 'enzyme';

import AudioSample from '../client/components/Audio.jsx';

describe('AUDIO SAMPLE BUTTON', () => {

  beforeEach(() => {
    //prevent audio from actually playing
    window.HTMLMediaElement.prototype.play = () => {
      return new Promise((resolve) => {
        resolve();
      })
    };
    //prevent date from throwing error
    window.Date.prototype.toISOString = (val) => {
      return 'YYYY-MM-DDTHH:10:20.sssZ'
    };
  });

  it(`should display proper button on load`, async () => {
    const component = await mount(<AudioSample audio={ new Audio('https://hr-rpt-audible.s3-us-west-1.amazonaws.com/001-a-promised-land.mp3')}/>);

    expect(component.containsAllMatchingElements([
      <span>Sample</span>
    ])).toBe(true);
  });

  it(`should toggle proper button on click`, async () => {
    const component = await mount(<AudioSample audio={new Audio('https://hr-rpt-audible.s3-us-west-1.amazonaws.com/001-a-promised-land.mp3')}/>);

    component.find('button').simulate('click');

    setTimeout(() => {
      expect(component.containsAllMatchingElements([
        <img src="https://hr-rpt-audible.s3-us-west-1.amazonaws.com/loading.gif" width='16px' height='16px'></img>
      ])).toBe(true);
    }, 100);

    setTimeout(() => {
      expect(component.containsAllMatchingElements([
        <img src="https://hr-rpt-audible.s3-us-west-1.amazonaws.com/pause_04.png" width='16px' height='16px'></img>
      ])).toBe(true);
    }, 600);
  });

  it(`should change state on click`, async () => {
    const component = await mount(<AudioSample audio={new Audio('https://hr-rpt-audible.s3-us-west-1.amazonaws.com/001-a-promised-land.mp3')}/>);

    component.find('button').simulate('click');

    setTimeout(() => {
      expect(component.state.loading).toBe(true);
    }, 100);

    setTimeout(() => {
      expect(component.state.playing).toBe(true);
      expect(component.state.played).toBe(true);
    }, 600);

    component.find('button').simulate('click');

    setTimeout(() => {
      expect(component.state.playing).toBe(false);
      expect(component.state.played).toBe(true);
    }, 100);

  });
});