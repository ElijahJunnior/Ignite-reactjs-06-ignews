import { render, screen } from '@testing-library/react';
import Home, { getStaticProps } from '../../pages/';
import { stripe } from '../../services/stripe';

jest.mock('next/router');
jest.mock('next-auth/client', () => { 
  return {
    useSession: () => [null, false]
  }
});
jest.mock('../../services/stripe');

describe('Home Page', () => { 

  it('renders correctaly', () => { 
    render(
      <Home product={{
          priceId: 'fake-priceId', 
          amount: '$9.90'
        }}      
      />
    );
    expect(screen.getByText('for $9.90 month')).toBeInTheDocument();
  })

  it('load initial data', async () => { 
    
    const retrievePriceStripeMocked = jest.mocked(stripe.prices.retrieve)

    // mockResolvedValueOnce determina que o objeto retornado será uma promisse
    retrievePriceStripeMocked.mockResolvedValueOnce({
      id: 'fake-price-id', 
      unit_amount: 1000, 
    } as any)

    const response = await getStaticProps({})

    // espera que o objeto analisado seja igual ao definido
    expect(response).toEqual(
      // define como o objeto deve ser para o teste passar
      // será verificado se ele tem pelomenos as propriedade informadas
      // caso ele tenha alguma propriedade a mais, nenhum erro vai ocorrer
      expect.objectContaining({
        props: { 
          product: { 
            priceId: 'fake-price-id', 
            amount: '$10.00' 
          } 
        }
      })
    )

  })

})