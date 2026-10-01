export interface TipoProduto {
    id: number,
    nome: string,
    preco: number,
    descricao: string,
    avatar: string,
}

export type TipoProdutoJ = {
    id: string;
    nome: string; 
    preco: number;
    estoque: number;
    avatar: string;
}