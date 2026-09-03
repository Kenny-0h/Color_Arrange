# Color Arrange

Um jogo de lógica e estratégia matemática baseado na organização de peças em um tabuleiro. O jogador deve reorganizar todas as peças em suas posições corretas utilizando movimentos válidos, buscando obter a maior pontuação possível.

## Objetivo

O objetivo do **Color Arrange** é organizar todas as peças do tabuleiro em suas respectivas posições, utilizando uma sequência de movimentos válidos.

A partida não possui uma condição de derrota por erros. O jogador pode continuar movimentando as peças até solucionar o tabuleiro ou desistir da partida. A pontuação final é determinada pela eficiência do jogador, considerando o **tempo gasto** e o **número de movimentos realizados**, levando em consideração o tamanho do tabuleiro.

---

## Regras do jogo

### Tabuleiro

O jogo utiliza um tabuleiro quadrado de tamanho `N × N`, contendo:

* `N² - 1` peças;
* uma única posição vazia.

Inicialmente, as peças são embaralhadas e distribuídas pelo tabuleiro.

O jogo será desenvolvido inicialmente utilizando um tabuleiro `3 × 3`, mas sua estrutura será genérica para permitir posteriormente tabuleiros maiores, como `4 × 4`, `5 × 5` e até `10 × 10`.

### Movimentação

Um movimento consiste em deslocar uma ou mais peças consecutivas em direção ao espaço vazio.

Para realizar um movimento, o jogador deve clicar em uma peça que:

1. esteja na mesma linha ou coluna do espaço vazio;
2. possua um caminho contínuo de peças entre ela e o espaço vazio.

Todas as peças entre a peça selecionada e o espaço vazio são deslocadas simultaneamente em uma posição na direção do espaço vazio, preservando sua ordem.

O espaço vazio passa então a ocupar a posição originalmente ocupada pela peça selecionada.

#### Exemplo

Considerando a seguinte sequência:

```text
I  J  [ ]  L  Q  R  S
```

Os seguintes movimentos são válidos:

* clicar em `L` → move `L`;
* clicar em `Q` → move `L, Q`;
* clicar em `R` → move `L, Q, R`;
* clicar em `S` → move `L, Q, R, S`.

Ao clicar em `S`, por exemplo:

```text
Antes:

I  J  [ ]  L  Q  R  S

Depois:

I  J  L  Q  R  S  [ ]
```

A mesma regra é aplicada verticalmente.

Movimentos diagonais ou movimentos em que as peças não estejam alinhadas com o espaço vazio não são permitidos.

---

## Condição de vitória

A partida é vencida quando todas as peças estiverem posicionadas em suas respectivas posições corretas.

Após a vitória, a partida é encerrada e as métricas da partida podem ser apresentadas ao jogador.

---

## Desistência

O jogador pode desistir da partida a qualquer momento.

Ao desistir, a partida é encerrada e o jogador retorna à tela inicial.

---

## Reinício

O jogador poderá iniciar uma nova partida a qualquer momento.

Ao iniciar uma nova partida:

* o tabuleiro é recriado;
* as peças são novamente embaralhadas;
* o temporizador é zerado;
* o número de movimentos é zerado;
* a pontuação é reiniciada;
* o estado da partida é reinicializado.

O embaralhamento será realizado de maneira que o tabuleiro gerado permaneça solucionável.

---

## Pontuação

A pontuação tem como objetivo recompensar partidas realizadas com maior eficiência.

O jogador começa com uma pontuação máxima de referência de **1000 pontos**.

A pontuação final considera dois fatores:

* eficiência no número de movimentos;
* eficiência no tempo utilizado.

Como tabuleiros maiores naturalmente exigem mais movimentos e mais tempo, o cálculo será normalizado de acordo com o tamanho `N × N` do tabuleiro.

A pontuação será composta por:

* **60% referente à eficiência dos movimentos**;
* **40% referente à eficiência do tempo**.

Os dois componentes serão calculados individualmente e combinados em uma pontuação final entre **1 e 1000 pontos**.

Dessa forma, o tamanho do tabuleiro será considerado no cálculo e tabuleiros maiores não serão penalizados injustamente em relação aos menores.

A fórmula definitiva poderá ser calibrada durante a implementação e os testes do jogo.

---

## Informações da partida

Durante uma partida, a interface deverá apresentar, inicialmente:

* **tempo decorrido**;
* **número de movimentos**;
* **pontuação atual**;
* **tabuleiro**;
* controles para iniciar/reiniciar ou desistir da partida.

Funcionalidades visuais adicionais poderão ser incorporadas posteriormente sem alterar a mecânica principal do jogo.

---

## Tecnologias utilizadas

O projeto será desenvolvido exclusivamente utilizando tecnologias web básicas:

* HTML5;
* CSS3;
* JavaScript puro.

Não serão utilizados frameworks ou bibliotecas externas para a implementação da lógica principal do jogo.

---

## Responsividade

A interface será desenvolvida de maneira responsiva, permitindo que o jogo seja executado e utilizado em diferentes dispositivos e tamanhos de tela, incluindo computadores, tablets e smartphones.

O tamanho do tabuleiro deverá se adaptar ao espaço disponível sem comprometer a interação com as peças.

---

## Estrutura do projeto

A estrutura do projeto será organizada de forma a separar a estrutura, apresentação e lógica da aplicação.

Uma estrutura inicial prevista é:

```text
Color_Arrange/
│
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js│
├── README.md
└── LICENSE
```

A estrutura poderá ser modificada durante o desenvolvimento caso seja necessário separar melhor os componentes da aplicação.

---

## Publicação

O jogo será publicado utilizando **GitHub Pages**, permitindo que seja executado diretamente pelo navegador.

**Jogo:** [link para o GitHub Pages]

**Repositório:** [link para o repositório]

---

## Informações do projeto

```json
{
  "nome": "Color Arrange",
  "descricao": "Jogo de lógica no qual o jogador deve organizar as peças de um tabuleiro utilizando movimentos válidos, buscando completar o desafio com o menor tempo e número de movimentos possível.",
  "autores": "Nome do estudante",
  "turma": "14A"
}
```

---

## Licença

Este projeto está licenciado sob a **MIT License**.
