class VagaComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._dados = null;
  }

  // Recebe o objeto da vaga (com compat e cor já calculados pela página)
  set dados(valor) {
    this._dados = valor;
    this.render();
  }

  render() {
    const v = this._dados;
    if (!v) return;

    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="styles_componente.css">
      <div class="vaga">
        <span class="comp" style="background: ${v.cor};">${v.compat}%</span>
        <h4>${v.t}</h4>
        <small>${v.e}</small><br>
        ${v.nova ? '<span class="tag nova">Nova</span>' : ''}
        <span class="tag">${v.mod}</span>
        <span class="tag">${v.carga}/dia</span>
        <span class="tag">${v.bolsa}</span>
      </div>
    `;

    // Avisa a página qual vaga foi escolhida
    this.shadowRoot.querySelector('.vaga').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('vaga-selecionada', {
        detail: v.id, bubbles: true, composed: true
      }));
    });
  }
}

customElements.define('vaga-component', VagaComponent);
