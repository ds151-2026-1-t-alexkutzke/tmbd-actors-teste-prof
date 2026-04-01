[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/Bt94tZ7T)
Tecnologia em Análise e Desenvolvimento de Sistemas

Setor de Educação Profissional e Tecnológica - SEPT

Universidade Federal do Paraná - UFPR

---

*DS151 - Desenvolvimento para Dispositivos Móveis*

Prof. Alexander Robert Kutzke

# Exercício: Expandindo a Navegação (Elenco e Filmografia)

O objetivo desta prática é aprofundar o uso do roteamento dinâmico e o controle de efeitos colaterais. Implemente um fluxo contínuo de navegação entre filmes e atores, reproduzindo exatamente o comportamento demonstrado no GIF em anexo.

<img src="images/exemplo.gif" width="400px" alt="Exemplo de funcionamento do App" />

**Requisitos da Implementação:**

1. **Atualização da Tela de Filme:** Adicionar uma lista horizontal exibindo o elenco principal da obra (endpoint `/movie/{id}/credits`). O card de cada ator deve ser um link para o seu perfil;
2. **Nova Rota de Ator (`app/actor/[id].tsx`):** Criar a tela de perfil contendo a foto, nome e biografia do artista;
3. **Otimização de Requisições:** Utilizar o `useEffect` na nova tela para buscar, de forma simultânea (via `Promise.all`), os dados biográficos (`/person/{id}`) e a filmografia do ator (`/person/{id}/movie_credits`);
4. **Navegação Cíclica:** Renderizar a filmografia do ator em uma lista clicável. Ao tocar em um pôster, o aplicativo deve abrir a tela de detalhes deste novo filme, empilhando a navegação.
5. **Tratamento de erros:** A aplicação deve garantir que o layout não quebre caso a API retorne atores sem foto de perfil ou sem biografia cadastrada.

## Lembrando

Clonar o projeto e executar o seguinte:

```
npm ci
npx expo start
```
