import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { Newsfeed } from './Newsfeed';
import { StatusPost } from './StatusPost';
import api from '../../js/Api';

// Mock the api module
jest.mock('../../js/Api', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

describe('StatusPost to Newsfeed integration test', () => {
  it('should show the posted status on the Newsfeed page', async () => {
    // Prepare the mock for the GET request in the Newsfeed component
    const postContent = 'Testing status update';
    api.get.mockResolvedValue({
      data: {
        posts: [
          { username: 'testuser', content: postContent },
        ],
      },
    });

    // Prepare the mock for the POST request in the StatusPost component
    api.post.mockResolvedValue({
      data: {
        success: true,
      },
    });

    // Render the Newsfeed and StatusPost within the same routing context
    render(
      <MemoryRouter>
        <Newsfeed />
        <StatusPost />
      </MemoryRouter>
    );

    // Simulate posting a status
    fireEvent.change(screen.getByPlaceholderText('Write your post here...'), { target: { value: postContent } });
    fireEvent.click(screen.getByText('Post'));

    // Re-render Newsfeed to show the new post
    render(
      <MemoryRouter>
        <Newsfeed />
      </MemoryRouter>
    );

    // Check if the post is visible on the Newsfeed
    expect(await screen.findByText(postContent)).toBeInTheDocument();
  });
});
