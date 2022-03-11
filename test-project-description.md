# Teste front-end

## Escopo

Utilizando os endpoints /users e /posts em https://jsonplaceholder.typicode.com:

1. Ter uma página principal com a listagem de usuários, limite até 3, apresentando seus nomes ([/users](https://jsonplaceholder.typicode.com/users));
1. Ter um botão "mostrar mais" ao final da listagem, sempre adicionando até 3 usuários a cada clique;
1. Ao clicar no nome do usuário, abrir uma modal suspensa na frente, sem interferir na listagem e centralizada na tela;
1. Na cabeçalho da modal, o nome do usuário e um botão de fechar;
1. No corpo da modal, a listagem de posts, limite até 3, apresentando título e corpo em cada item ([/posts?userId=:userId](https://jsonplaceholder.typicode.com/posts?userId=:userId));
1. Ter um botão "mostrar mais" ao final da listagem, sempre adicionando até 3 posts a cada clique;
1. Para cada post, um botão de ocultar que, ao clicar, oculta aquele item na listagem;
1. Ter um README.md listando o básico de instruções comuns utilizados em ambientes de desenvolvimento.

## Orientações:

- **Deverá** ser utilizado [React](https://reactjs.org);
- **Deverá** ser utilizado um repositório [Git](https://git-scm.com) de sua preferência e na devolutiva nos ceder o acesso;
- É avaliada stack escolhendo **à vontade [NextJS](https://nextjs.org) / [Redux](https://redux.js.org) / [Axios](https://axios-http.com) / [Typescript](https://www.typescriptlang.org)**, e as escolhas e complementaridade delas são avaliadas no teste;
- **É importante** a forma como escolhe organizar as partes do projeto em arquivos;
- **É importante** a forma como persiste os dados localmente, seja das requisições para disponibilizar para diferentes componentes, seja das ações que geram transições de estado;
- **É importante** as decisões e boas práticas de projeto, visando facilitar o trabalho em equipe, e em linha com as melhores práticas internacionais;
- Enquanto escopo, **é importante** evitar adicionar funcionalidades que não foram especificadas;
- É interessante utilizar o Bootstrap, seja diretamente as classes, seja escolhendo uma biblioteca de componentes, como [react-bootstrap](https://react-bootstrap.github.io);
- É interessante se limitar a HTML e CSS, mas é permitido outras escolhas de bibliotecas com componentes prontos, e as escolhas e a complementaridade delas são avaliadas no teste;
- Enquanto layout, faça o mínimo viável em diagramação da informação legível e em responsividade, sem dedicar esforço em estilização avançada;
- Se tiver experiência em iniciar projetos, e boas práticas envolvendo [BDUF](https://en.wikipedia.org/wiki/Big_Design_Up_Front) e [KISS](https://en.wikipedia.org/wiki/KISS_principle), então o teste deveria tomar no máximo de 3 a 5 horas.

**Importante:** revise os enunciados do teste logo que tiver recebido, reflita sobre como irá resolvê-lo, e já em seguida por favor nos dê retorno com um prazo estimado para a devolutiva. O objetivo é proporcionar a você tempo hábil para implementar o teste, de acordo com a sua disponibilidade de tempo entre outros compromissos. Mas só não podemos deixar passar de 10 dias, para ser justo com outras pessoas participando do mesmo processo seletivo.

## Agradecemos!

E estamos à disposição se houverem dúvidas e outras necessidades.
