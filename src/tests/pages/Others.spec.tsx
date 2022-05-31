import { render, screen } from '@testing-library/react';
import { SignInButton } from '../../components/SignInButton';
import { useSession } from 'next-auth/client';

jest.mock('next-auth/client');

describe('Others', () => { 
  
  it('exemple of logTestingPlaygroundURL', () => { 
    
    const useSessionMocked = jest.mocked(useSession);
    
    useSessionMocked.mockReturnValueOnce([null, false]);   

    render(
      <SignInButton />  
    );

    // cria uma pagina contendo uma ferramenta 
    // para te ajudar a localizar os elementos nos testes
    screen.logTestingPlaygroundURL()
   
  })  

})