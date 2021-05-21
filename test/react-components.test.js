import React from 'react';
import { mount } from 'enzyme';

import Title from '../client/components/Title.jsx';
import Info from '../client/components/Info.jsx';
import Image from '../client/components/Image.jsx';
import AudioSample from '../client/components/Audio.jsx';

const testBook = {
  "title": "A Promised Land",
  "subtitle": "this is a subtitle",
  "author": "Barack Obama",
  "narrator": "Michelle Obama",
  "imageUrl": "https://hr-rpt-audible.s3-us-west-1.amazonaws.com/001-a-promised-land.jpg",
  "audioSampleUrl": "https://hr-rpt-audible.s3-us-west-1.amazonaws.com/001-a-promised-land.mp3",
  "length": "29:10",
  "version": "Unabridged Audiobook",
  "categories": [
    { "name": "Biographies & Memoirs" },
    { "name": "Politics & Activism" }
  ]
}

describe('COMPONENTS', () => {

  beforeEach(() => {
    fetchMock.doMock();
  });

  it('TITLE: should render the book title and subtitle', async () => {
    const component = await mount(<Title book={testBook}/>);

    expect(component.text()).toContain(testBook.title);
    expect(component.text()).toContain(testBook.subtitle);
  });

  it('INFO: should render the book information', async () => {
    const component = await mount(<Info book={testBook}/>);

    expect(component.text()).toContain(testBook.author);
    expect(component.text()).toContain(testBook.narrator);
    expect(component.text()).toContain(testBook.version);
    expect(component.text()).toContain('29 hrs and 10 mins');
    expect(component.text()).toContain(testBook.categories[0].name);
    expect(component.text()).toContain(testBook.categories[1].name);
  });

  it('IMAGE: should render the book image', async () => {
    const component = await mount(<Image url={testBook.imageUrl}/>);
    expect(component.containsAllMatchingElements([
      <img height='100%' width='100%' src="https://hr-rpt-audible.s3-us-west-1.amazonaws.com/001-a-promised-land.jpg"></img>
    ])).toBe(true);
  });

  it('AUDIO: should render proper sample audio button (unplayed)', async () => {
    const component = await mount(<AudioSample audio={testBook.audioSampleUrl}/>);
    expect(component.containsAllMatchingElements([
      <img src="https://hr-rpt-audible.s3-us-west-1.amazonaws.com/play_04.png" width='16px' height='16px'></img>,
      <span>Sample</span>
    ])).toBe(true);
  });

});
