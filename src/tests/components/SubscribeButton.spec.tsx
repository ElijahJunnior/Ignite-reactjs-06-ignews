import { render, screen, fireEvent } from '@testing-library/react';
import { SubscribeButton } from '../../components/SubscribeButton';
import { signIn, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';

jest.mock('next-auth/client');
jest.mock('next/router')

describe('SubscribeButton component', () => { 
  
  it('renders correctly', () => { 

    const useSessionMocked = jest.mocked(useSession);
    
    useSessionMocked.mockReturnValueOnce(
      [null, false]
    );
 
    render( <SubscribeButton /> );

    expect(screen.getByText('Subscribe Now')).toBeInTheDocument();
   
  })  

  it('redirect user to SignIn when user not authenticated', () => { 

    // Carregando uma instancia do moc da funçõa signIn
    const signInMocked = jest.mocked(signIn);

    const useSessionMocked = jest.mocked(useSession);
    
    useSessionMocked.mockReturnValueOnce(
      [null, false]
    );

    // renderizando o componente que será testado
    render( <SubscribeButton />);

    // buscando o botão pelo texto
    const subscribeButton = screen.getByText('Subscribe Now');

    // disparando um click no botão 
    fireEvent.click(subscribeButton);

    // verificando se após o click a função signIn foi chamada
    expect(signInMocked).toHaveBeenCalled();

  })

  it('redirect to post when user already has a subscription', () => { 
    
    const useSessionMocked = jest.mocked(useSession);
    
    useSessionMocked.mockReturnValueOnce([{
      user: { name: 'John Doo', email: 'johndoo@email.com' }, 
      activeSubscription: 'fake_active_subscription', 
      expires: 'fake-expires'
    }, false]);
    
    // criando uma instancia do mock da função useRouter
    const useRouterMocked = jest.mocked(useRouter);
    
    // criando uma função para ser usada como retorno do mock 
    // de forma que seja possível verificar se ela foi chamada 
    const pushMocked = jest.fn();
    
    // definindo no mock o que deve ser retornado 
    // da próxima vez que a função for chamada
    useRouterMocked.mockReturnValueOnce({ 
      push: pushMocked, 
    } as any)  

    render(<SubscribeButton />);

    const subscribeButton = screen.getByText('Subscribe Now');

    fireEvent.click(subscribeButton);

    // verificando se afunção pushMocked foi chamada
    expect(pushMocked).toHaveBeenCalledWith('/posts');

  }) 

})