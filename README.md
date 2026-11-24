# Mercado de Trabalho — App Inatel

> 🎓 **Projeto acadêmico** desenvolvido para a disciplina **S05 – Interação Homem-máquina** (Engenharia de Software, Inatel). Os dados (vagas, empresas, e-mails) são **fictícios** e o envio da candidatura é **simulado**. Não há back-end nem integração real com o aplicativo oficial.

## Sobre o projeto

O aluno que procura o primeiro estágio hoje precisa visitar vários sites, sem saber se as vagas servem para o seu curso e período. Esta funcionalidade, proposta como uma nova aba do App Inatel, **centraliza as vagas de empresas parceiras**, mostra a **compatibilidade** de cada uma com o perfil do aluno e permite **candidatar-se e acompanhar o status** em um único fluxo.

A persona usada na análise é o próprio autor: aluno do 5º período de Engenharia de Software, em busca do primeiro estágio.

## Fluxo de uso (tarefa de ponta a ponta)

```
Início ──► Vagas (filtros) ──► Detalhe da vaga ──► Perfil ──► Revisão ──► Confirmação ──► Candidaturas
                                                     ▲            │
                                                     └── erro ────┘  (exceção: perfil incompleto)
```

1. **Início**: atalho "Mercado de Trabalho" com o contador de vagas novas compatíveis.
2. **Vagas**: filtros por área, modalidade e carga horária; lista ordenada por compatibilidade.
3. **Detalhe**: dados da vaga e percentual de compatibilidade.
4. **Perfil**: dados acadêmicos já preenchidos (somente leitura), e-mail, telefone e currículo em PDF (ou modelo).
5. **Revisão**: resumo da candidatura e autorização de compartilhamento de dados.
6. **Confirmação**: protocolo gerado e comprovante "enviado" por e-mail.
7. **Candidaturas**: linha do tempo do status (Enviada → Em análise → Entrevista → Resultado), com notificação simulada a cada mudança.

## Estrutura de arquivos

```
mercado-de-trabalho/
├── index.html              # Estrutura das telas (todas na mesma página, uma visível por vez)
├── vagas.json              # Dados das vagas (consumidos com fetch)
├── script_componente.js    # Web Component <vaga-component> (cartão da vaga, Shadow DOM)
├── script_pagina.js        # Navegação, filtros, regras de negócio, validações e candidatura
├── styles_componente.css   # Estilos do cartão da vaga (isolados no Shadow DOM)
├── styles_pagina.css       # Estilos da página (identidade visual do App Inatel)
└── README.md
```

## Como o código está dividido

| Camada | Arquivo | Responsabilidade |
|---|---|---|
| Estrutura | `index.html` | Seções `.tela` (home, vagas, detalhe, perfil, revisão, sucesso, cands), barra de navegação e toast |
| Dados | `vagas.json` | Título, empresa, área, modalidade, carga, bolsa, período mínimo, cursos-alvo e se a vaga é nova |
| Componente | `script_componente.js` + `styles_componente.css` | Desenha um cartão de vaga e dispara o evento `vaga-selecionada` ao clicar |
| Lógica da página | `script_pagina.js` | Controla qual tela aparece, aplica filtros, calcula compatibilidade, valida o formulário e guarda as candidaturas em memória |
| Aparência | `styles_pagina.css` | Cores, tipografia, cartões, chips de filtro, etapas, animações e estados de erro |

### Como as partes conversam

1. A página carrega `vagas.json` com `fetch` e guarda o resultado na variável `VAGAS`.
2. A função `listar()` filtra e ordena as vagas e cria um `<vaga-component>` para cada uma, passando os dados pela propriedade `dados`.
3. Ao clicar no cartão, o componente dispara o evento `vaga-selecionada` (com `bubbles` e `composed`, para atravessar o Shadow DOM).
4. A página escuta o evento, chama `abrir(id)` e segue o fluxo com `go('detalhe')`, `go('perfil')` etc.

### Principais funções de `script_pagina.js`

| Função | O que faz |
|---|---|
| `go(tela)` | Mostra uma tela, atualiza o cabeçalho e a navegação inferior; mantém o histórico para o botão voltar |
| `listar()` | Aplica os filtros, ordena por compatibilidade e renderiza os componentes |
| `compat(vaga)` | Calcula o percentual de compatibilidade (regra abaixo) |
| `valida()` | Valida e-mail, telefone e currículo, destacando os campos com erro |
| `revisar()` / `enviar()` | Montam o resumo e simulam o envio, gerando o protocolo |
| `listarC()` / `avanca(i)` | Exibem as candidaturas e simulam a mudança de status com notificação |

## Regras de negócio

**Compatibilidade da vaga**

| Situação | Resultado |
|---|---|
| Curso do aluno não está nos cursos-alvo da vaga | 0% (candidatura bloqueada) |
| Período do aluno ≥ período mínimo | 95% |
| Período do aluno abaixo do mínimo | 95% − 15 pontos por período faltante (mínimo de 60%) |

A cor do selo muda conforme o valor: **verde** (≥ 90%), **laranja** (≥ 60%) e **vermelho** (abaixo disso).

**Validações do formulário**

- E-mail em formato válido.
- Telefone com DDD e 11 dígitos (máscara aplicada durante a digitação).
- Currículo obrigatório, em **PDF** de até **2 MB** (ou uso do modelo de currículo).
- Autorização de compartilhamento de dados marcada na revisão.
- Não é possível se candidatar duas vezes à mesma vaga.
- Se algo estiver faltando, os campos ficam em vermelho e **os dados já preenchidos são mantidos**.

**Feedbacks ao usuário:** barra de progresso no anexo, botão "Enviando...", animação de sucesso, mensagem de erro por campo, estado vazio nos filtros e *toast* para notificações.

## Conceitos aplicados

- **Análise da tarefa** (hierarquia objetivo > submetas > operações, com exceções e tarefas opcionais)
- **Custom Elements** e **Shadow DOM** (`class VagaComponent extends HTMLElement`, `customElements.define`)
- **Eventos personalizados** (`CustomEvent`) para comunicação entre componente e página
- **Consumo de JSON** com `fetch` e `async/await`
- **Template literals** para gerar o HTML dinamicamente
- **Validação de formulário** e feedback visual
- **Design responsivo** com largura máxima mobile e estilo do App Inatel (azul `#126ae2`)

## Documentação de apoio

A entrega em PDF contém User Story, Análise da Tarefa, Fluxo de Informação (Diagrama de Classes) e Wireframes, todos coerentes com as telas deste projeto.

## Autor

Gabriel Silva Lopes
Engenharia de Software — Inatel

## Licença

Trabalho acadêmico desenvolvido para fins educacionais.