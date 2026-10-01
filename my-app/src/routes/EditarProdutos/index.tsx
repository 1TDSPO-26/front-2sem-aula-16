import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import type { TipoProdutoJ } from "../../types/types";
import { useForm } from "react-hook-form";

export default function EditarProdutos() {
    //Modificar o titulo da página
    document.title = "Editar Produtos"

    //Importando hook 
    const navigate = useNavigate()

    //Declarando os componentes do hookForm
    const{register, handleSubmit, setValue, reset, formState: {errors}} = useForm<TipoProdutoJ>({
        defaultValues: {id: "", nome: "", preco: 0, estoque: 0, avatar: ""}, 
        mode:"onChange"});

    //Recuperar o parâmetro da rota através do hook useParams, desestruturando o objeto 

    const { id } = useParams<{id:string}>();

    //Criando o recipiente da lista de dados e tipando com o tipo de produto
    const [produto, setProduto] = useState<TipoProdutoJ>({id: "", nome: "", preco: 0, estoque: 0, avatar: ""});

        useEffect( ()=>{
            //Simulando a requisição para o backend
    
            const carregaProduto = async ()=>{
    
                try {
    
                    const resposta = await fetch(`http://localhost:3001/produtos/${id}`);
    
                    if(!resposta.ok){
                        throw new Error(`Produto não encontrado: ${resposta.status} - ${resposta.statusText}`) //Lançando exceção
                    }
    
                    const data:TipoProdutoJ = await resposta.json();
                    console.log(data);
                    setProduto(data);
                    reset(data);
    
                } catch (error) {
                    console.error(error);
                }
            }
    
            carregaProduto();
    
        },[]);

        const handleUpdate = async () => {
            try {
              
                const response = await fetch(`http://localhost:3001/produtos/${produto.id}` ,{
                    method: "PUT",
                    headers:{
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(produto)
                });
                    //Se der erro
                    if(!response.ok){
                        throw new Error(`A atualização falhou: ${response.status} - ${response.statusText}`) //Lançando exceção
                    }

                    //Se der certo (mensagem de sucesso)
                    alert("Atualização realizada com sucesso!");
                    //Redirecionando para a página de produtos
                    navigate("/produtos");


            } catch (error) {
                console.log(error);
            }
        }



    return(
        <main>
            <h2>Editar Produtos</h2>
            <div>
                <form>
                    <fieldset>
                        <legend>Dados do Produto</legend>
                        <div>
                            <label htmlFor="nome">Nome do Produto: </label>
                            <input type="text" {...register("nome", {required: "Preenchimento do campo é obrigatório!", minLength: 
                                {value: 3, message: "O campo deve ter no mínimo 3 caracteres"}} )}/>
                                {errors.nome && <span style={{color: "#ff0000"}}>{errors.nome.message}</span> }
                        </div>
                        <div>
                            <label htmlFor="preco">Preço R$: </label>
                            <input type="number" step={0.1} {...register("preco",{required: "Preenchimento do campo é obrigatório!", min:{value:1,
                                message:"O Valor mínimo é 1"}})}/>
                                {errors.preco && <span style={{color: "#ff0000"}}>{errors.preco.message}</span> }
                        </div>
                        <div>
                            <label htmlFor="estoque">Estoque: </label>
                            <input type="number" step={1} {...register("estoque",{required: "Preenchimento do campo é obrigatório!", min:{value:1,
                                message:"O Valor mínimo é 1"}})}/>
                                {errors.estoque && <span style={{color: "#ff0000"}}>{errors.estoque.message}</span> }
                        </div>

                        <div>
                            <figure>
                                <img src={produto.avatar} alt={produto.nome} />
                                <figcaption>{produto.nome}</figcaption>
                            </figure>
                        </div>
                        <div>
                            <button type="button" onClick={handleUpdate}>Editar</button>
                        </div>
                    </fieldset>
                </form>
            </div>
        </main>
    )

}