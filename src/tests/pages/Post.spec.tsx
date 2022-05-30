import { render, screen } from '@testing-library/react';
import { getSession } from 'next-auth/client';
import Post, { getServerSideProps } from '../../pages/posts/[slug]';
import { getPrismicClient } from '../../services/prismic'

jest.mock('../../services/prismic');
jest.mock('next-auth/client');

const post = { 
  slug: 'my-new-post', 
  title: 'My new post', 
  content: '<p>Post content</p>', 
  updatedAt: '10 de Abril'
};
 
describe('Post Page', () => { 

  it('renders correctaly', () => { 
    render(
      <Post post={post} />
    );
    expect(screen.getByText('My new post')).toBeInTheDocument();
    expect(screen.getByText('Post content')).toBeInTheDocument();
  });
  
  it('redirect user to preview if subscription is found', async () => { 
   
    const getSessionMocked = jest.mocked(getSession);

    getSessionMocked.mockResolvedValueOnce(null)

    const response = await getServerSideProps({
      params: { 
        slug: 'my-new-post'
      }
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({ 
          destination: '/posts/preview/my-new-post', 
        })
      })
    )

  })

  it('redirect user to preview if subscription is found', async () => { 
   
    const getSessionMocked = jest.mocked(getSession);
    const getPrismicClientMocked = jest.mocked(getPrismicClient);

    getSessionMocked.mockResolvedValueOnce({ 
      activeSubscription: 'fake-active-subscription'
    })

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
    } as any)

    const response = await getServerSideProps({ 
      params: { slug: 'my-new-post' }
    } as any)

    expect(response).toEqual(
      expect.objectContaining({ 
        props: { 
          post: { 
            slug: 'my-new-post', 
            title: 'My new post', 
            content: '<p>Post content</p>', 
            updatedAt: '01 de abril de 2021'
          }
        }
      })
    )

  })
  
})