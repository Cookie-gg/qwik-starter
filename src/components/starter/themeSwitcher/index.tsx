import { component$, useContext } from '@builder.io/qwik';
import { ThemeContext } from '~/routes';

export const ThemeDisply = component$(() => {
  const theme = useContext(ThemeContext);

  return <>current theme: {theme}</>;
});
