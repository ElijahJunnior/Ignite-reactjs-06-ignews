import { render, screen } from '@testing-library/react';
import Posts, { getStaticProps } from '../../pages/posts';
import { getPrismicClient } from '../../services/prismic'

jest.mock('../../services/prismic');

const posts = [
  { slug: 'my-new-post', title: 'My new post', excerpt: 'Post excerpt', updatedAt: '10 de Abril'}
];
 
describe('Posts Page', () => { 

  it('renders correctaly', () => { 
    render(
      <Posts posts={posts} />
    );
    expect(screen.getByText('My new post')).toBeInTheDocument();
  });

  it('load initial data', async () => { 
    
    const getPrismicClientMocked = jest.mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({ 
      // define o valor que deve ser retornado pela função do mock
      // mockResolved é usado para retornar uma promise ao inves de um valor 
      query: jest.fn().mockResolvedValueOnce({
        results: [
          { 
            uid: 'my-new-post', 
            data: { 
              title: [
                { type: 'heading', text: 'My new post'}
              ], 
              content: [
                { type: 'paragraph', text: 'Post excerpt' }
              ]
            }, 
            last_publication_date: '04-01-2021'
          }  
        ]
      })
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: { 
          posts: [{ 
            slug: 'my-new-post', 
            title: 'My new post',
            excerpt: 'Post excerpt', 
            updatedAt: '01 de abril de 2021'
          }] 
        }
      })
    )

  })

})