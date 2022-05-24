import { render } from '@testing-library/react';
import { escape } from 'querystring';
import { ActiveLink } from '.';

// cria um mock para imitar um modulo - no caso do exemplo next/router
jest.mock('next/router', () => { 
  return { 
    // função fake do modulo imitada
    useRouter() { 
      return { 
        // retornando um valor para a função que seja conveniente para o teste
        asPath: '/'
      }
    }
  }
})

// cria uma descrição para um determinado grupo de testes
describe('ActiveLink component', () => { 
  
  test('active link renders correctly', () => { 
    // a função render renderiza o componente de forma virtual, 
    // para que o teste possa ver seu conteudo 
    const { 
      // retorna o html gerado pela função render
      debug, 
      // busca dentro do html um elemento que contenha o texto especificado
      getByText 
    } = render( 
      <ActiveLink href="/" activeClassName='active'>
        <a>Home</a>
      </ActiveLink>
    )
    
    // busca um elemento dentro do documento que contenha o texto Home
    expect(getByText('Home')).toBeInTheDocument();
  
  })
  
  it('adds active class if the link as currently active.', () => { 
    
    const { getByText } = render(
      <ActiveLink href="/" activeClassName='active'>
        <a>Home</a>
      </ActiveLink>
    )
  
    // verifica se o elemento contendo o texto HOME possui a classe ACTIVE
    expect(getByText('Home')).toHaveClass('active');
  
  })
  
})