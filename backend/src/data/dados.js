/**
 * Catálogo e estado volátil do servidor.
 * Apenas o pedido atual é mantido; a sequência persiste enquanto o processo roda.
 */
const produtos = [
  {
    id: 1,
    nome: 'Pão Francês',
    categoria: 'Pães',
    preco: 0.80,
    estoque: 5000,
    imagem: 'https://cloudfront-us-east-1.images.arcpublishing.com/estadao/YGTBNTCNPZEQBMWTZVUIIZWPSY.jpeg'
  },
  {
    id: 2,
    nome: 'Pão Doce',
    categoria: 'Pães',
    preco: 1.50,
    estoque: 3000,
    imagem: 'https://www.saborosaviagem.com.br/wp-content/uploads/paocreme.jpg'
  },
  {
    id: 3,
    nome: 'Pão de Queijo',
    categoria: 'Pães',
    preco: 2.50,
    estoque: 4000,
    imagem: 'https://gastronomiacarioca.zonasul.com.br/wp-content/uploads/2024/08/pao_de_queijo_destaque_ilustrativa_zona_sul.jpg'
  },
  {
    id: 4,
    nome: 'Croissant',
    categoria: 'Pães',
    preco: 3.50,
    estoque: 2000,
    imagem: 'https://revistaanamaria.com.br/wp-content/uploads/2024/06/12244.jpg'
  },
  {
    id: 5,
    nome: 'Coxinha',
    categoria: 'Salgados',
    preco: 2.00,
    estoque: 2500,
    imagem: 'https://www.delicioso.com.br/wp-content/uploads/migration/coxinha-assada-0422.jpg'
  },
  {
    id: 6,
    nome: 'Bolinho de Queijo',
    categoria: 'Salgados',
    preco: 2.50,
    estoque: 2000,
    imagem: 'https://tiavaleria.com.br/wp-content/uploads/2025/11/Bolinho-de-queijo.png'
  },
  {
    id: 7,
    nome: 'Enroladinho de Salsicha',
    categoria: 'Salgados',
    preco: 2.00,
    estoque: 1500,
    imagem: 'https://img.saborosos.com.br/imagens/enroladinho-de-salsicha-frito.jpg'
  },
  {
    id: 8,
    nome: 'Empada de Frango',
    categoria: 'Salgados',
    preco: 6.00,
    estoque: 5000,
    imagem: 'https://canaldareceita.com.br/wp-content/uploads/2024/09/EMPADA-DE-FRANGO.jpg'
  },
  {
    id: 9,
    nome: 'Café Expresso',
    categoria: 'Bebidas',
    preco: 3.50,
    estoque: 5000,
    imagem: 'https://receitasmondial.com.br/wp-content/uploads/2024/11/Cafe-Espresso.jpg'
  },
  {
    id: 10,
    nome: 'Suco de Laranja 300ml',
    categoria: 'Bebidas',
    preco: 7.00,
    estoque: 3000,
    imagem: 'https://images.pexels.com/photos/10277954/pexels-photo-10277954.jpeg'
  },
  {
    id: 11,
    nome: 'Refrigerante 350ml',
    categoria: 'Bebidas',
    preco: 5.00,
    estoque: 4000,
    imagem: 'https://alloydeliveryimages.ligafiles.com.br/item_images/2649/646f9a4fbfa8flstpb.webp'
  },
  {
    id: 12,
    nome: 'Bolo de Chocolate (Fatia)',
    categoria: 'Doces',
    preco: 8.50,
    estoque: 5000,
    imagem: 'https://irp.cdn-website.com/33406c6e/dms3rep/multi/Bolo-de-chocolate.jpeg'
  },
  {
    id: 13,
    nome: 'Sonho de Creme',
    categoria: 'Doces',
    preco: 4.50,
    estoque: 5000,
    imagem: 'https://docestemperos.com/wp-content/uploads/2025/05/Como-Fazer-Sonho-de-Padaria-Fofinho-com-Creme-Perfeito-Receita-Simples-e-Irresistivel.webp'
  }
];

let pedidoAtual = null;
let numeroPedido = 0;

function definirPedidoAtual(pedido) {
  pedidoAtual = pedido;
}

module.exports = {
  produtos,
  get pedidoAtual() {
    return pedidoAtual;
  },
  get numeroPedido() {
    return numeroPedido;
  },
  proximoNumeroPedido() {
    return ++numeroPedido;
  },
  definirPedidoAtual
};