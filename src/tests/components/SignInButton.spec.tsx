import { render, screen } from '@testing-library/react';
import { SignInButton } from '../../components/SignInButton';
import { useSession } from 'next-auth/client';

jest.mock('next-auth/client');

describe('SignInButton component', () => { 
  
  it('renders correctly when user is not authenticated', () => { 
    
    // cria uma instancia mocada da função useSession da lib next-auth/client
    const useSessionMocked = jest.mocked(useSession);
    
    // define que as vezes, apartir daqui, que a função mocada for chamada
    // ela deve retornar [null, false]
    // useSessionMocked.mockReturnValue([null, false]);   

    // define que a função mocada deve retornar [null, false] na próxima vez que for chamada
    useSessionMocked.mockReturnValueOnce([null, false]);   

    render(
      <SignInButton />  
    );

    expect(screen.getByText('Sign in with Github')).toBeInTheDocument();
   
  })  

  it('renders correctly when user is authenticated', () => { 

    const useSessionMocked = jest.mocked(useSession);
    
    // define que a função mocada deve retornar os dados de sessão 
    // na próxima vez que for chamada
    useSessionMocked.mockReturnValueOnce([{
      user: { name: 'John Doo', email: 'johndoo@email.com' }, 
      expires: 'fake-expires'
    }, false]);
    
    render(
      <SignInButton />  
    );

    expect(screen.getByText('John Doo')).toBeInTheDocument();
   
  })  

})