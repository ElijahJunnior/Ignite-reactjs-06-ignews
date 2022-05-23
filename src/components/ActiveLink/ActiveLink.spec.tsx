import { render } from '@testing-library/react';
import { ActiveLink } from '.';

test('active link renders correctly', () => { 
  // a função render renderiza o componente de forma virtual, 
  // para que o teste possa ver seu conteudo 
  const { debug } = render( 
    <ActiveLink href="/"  activeClassName='active'>
      <a>Home</a>
    </ActiveLink>
  )
  debug();
})