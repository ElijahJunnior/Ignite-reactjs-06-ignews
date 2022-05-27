import { render, screen } from '@testing-library/react';
import { Header } from '../../components/Header';

// cria um mock para imitar um modulo - no caso do exemplo next/router
jest.mock('next/router', () => { 
  return { 
    // função fake do modulo imitada
    useRouter() { 
      return { 
        // retornando um valor para a função que seja conveniente para o teste
        asPath: '/'
      };
    }
  };
});

jest.mock('next-auth/client', () => { 
  return {
    useSession() {
      return [null, false];
    }
  };
});

// cria uma descrição para um determinado grupo de testes
describe('Header component', () => { 
  
  it('stay renders correctly', () => { 
    
    render(
       <Header />  
    );
    
    // busca um elemento que contenha um texto pre determinado
    // o uso da função screen eleimina a necessidade de desestruturação do render
    expect(screen.getByText('Home')).toBeInTheDocument();
    
    expect(screen.getByText('Posts')).toBeInTheDocument();
  
  })  
})