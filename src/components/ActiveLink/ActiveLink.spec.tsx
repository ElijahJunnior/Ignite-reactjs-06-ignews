import { render } from '@testing-library/react';
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

test('active link renders correctly', () => { 
  // a função render renderiza o componente de forma virtual, 
  // para que o teste possa ver seu conteudo 
  const { 
    // retorna o html gerado pela função render
    debug 
  } = render( 
    <ActiveLink href="/" activeClassName='active'>
      <a>Home</a>
    </ActiveLink>
  )
  // debug();


})