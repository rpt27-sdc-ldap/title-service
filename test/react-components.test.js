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
  "narrator": "Barack Obama",
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
    expect(component.containsAllMatchingElements([
      <h1>A Promised Land</h1>,
      <h2>this is a subtitle</h2>
    ])).toBe(true);
  });

  it('INFO: should render the book information', async () => {
    const component = await mount(<Info book={testBook}/>);
    expect(component.containsAllMatchingElements([
      <li>By: <a href="#">Barack Obama</a></li>,
      <li>Narrated By: <a href="#">Barack Obama</a></li>,
      <li>Length: 29 hrs and 10 mins</li>,
      <li>Unabridged Audiobook</li>,
      <li>Categories:
        <span key='0'><a href="#">Biographies &amp; Memoirs</a>, </span>
        <a key='1' href="#">Politics &amp; Activism</a>
      </li>
    ])).toBe(true);
  });

  it('IMAGE: should render the book image', async () => {
    const component = await mount(<Image url={testBook.imageUrl}/>);
    expect(component.containsAllMatchingElements([
      <img height='100%' width='100%' src="https://hr-rpt-audible.s3-us-west-1.amazonaws.com/001-a-promised-land.jpg"></img>
    ])).toBe(true);
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
