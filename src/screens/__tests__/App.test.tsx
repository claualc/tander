import { LoadingComponent } from '@components/index';
import React from 'react';
import renderer from 'react-test-renderer';

describe("global", () => {
 
  it('renders correctly', () => {
    const tree = renderer.create(<LoadingComponent />);
    expect(tree).toBeDefined()
  });
})

