import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import Post, {getStaticProps } from '../../pages/posts/preview/[slug]';
import { getPrismicClient } from '../../services/prismic'

jest.mock('../../services/prismic');
jest.mock('next-auth/client');
jest.mock('next/router');

const post = { 
  slug: 'my-new-post', 
  title: 'My new post', 
  content: '<p>Post content</p>', 
  updatedAt: '10 de Abril'
};
 
describe('Post Preview Page', () => { 

  it('renders correctaly', () => { 
    
    const useSessionMocked = jest.mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null, false])

    render(
      <Post post={post} />
    );

    expect(screen.getByText('My new post')).toBeInTheDocument();
    expect(screen.getByText('Post content')).toBeInTheDocument();
    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument();

  });
  
  it('redirect user to full post when user is subscribed', async () => { 
   
    const useSessionMocked = jest.mocked(useSession);
    const useRouterMocked = jest.mocked(useRouter);
    const pushMock = jest.fn();

    useSessionMocked.mockReturnValueOnce([{ 
      activeSubscription: 'fake-active-subscription'
    }, false] as any);

    useRouterMocked.mockReturnValueOnce({
      push: pushMock, 
    } as any);

    render(<Post post={post} />);

    expect(pushMock).toHaveBeenCalledWith('/posts/my-new-post');

  })

  it('load initial data', async () => { 
   
    const getPrismicClientMocked = jest.mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({ 
      getByUID: jest.fn().mockResolvedValueOnce({ 
        data: { 
          title: [ 
            { type: 'heading', text: 'My new post' }, 
          ], 
          content: [
            { type: 'paragraph', text: 'Post content'}
          ]
        }, 
        last_publication_date: '04-01-2021'
      })
    } as any);

    const response = await getStaticProps({params: { slug: 'my-new-post'}});

    expect(response).toEqual(
      expect.objectContaining({ 
        props: expect.objectContaining({ 
          post: { 
            slug: 'my-new-post', 
            title: 'My new post', 
            content: '<p>Post content</p>', 
            updatedAt: '01 de abril de 2021'
          }
        })
      })
    );

  })

})