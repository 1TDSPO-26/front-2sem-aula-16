
import { useNavigate,useParams } from "react-router"
import type { TipoProdutoJson } from "../../types/types";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";




export default function EditarProdutos() {
  document.title = "Editar Produtos"

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>()

  //declarando o componente do hook-form
  const { register, handleSubmit, reset, formState: { errors } } = useForm<TipoProdutoJson>({
    defaultValues: {
      id: "",
      nome: "",
      preco: 0,
      estoque: 0,
      avatar: ""
    }, mode: "onBlur"
  });
  // recuperando o id do produto da URL (params)
  
  useEffect(() => {
    // requisição para o backend apenas uma vez
    const carregarProdutos = async () => {
      try {
        const response = await fetch(`http://localhost:3001/produtos/${id}`);
        if (!response.ok) {
          throw new Error(`Erro produto não encontrado: ${response.status} ${response.statusText}`);
        }
        const data: TipoProdutoJson = await response.json();
        console.log("Produtos carregados:", data);
        
        reset(data); // Atualiza os valores do formulário com os 
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      }
    };
    carregarProdutos();
  }, [id, reset]);

  const handleUpdateProduto = async (data: TipoProdutoJson)=>{
      try {

        const response = await fetch(`http://localhost:3001/produtos/${data.id}` , {
          method:"PUT",
          headers:{
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });

              if (!response.ok) {
                  throw new Error(`A atualização falhou: ${response.status} - ${response.statusText}`)
              }

              //MSG de SUCESSO
              alert("Atualização realizada com sucesso!");
              //Redirecionando para a página de produtos
              navigate("/produtos");

      } catch (error) {
        console.error(error);
      }
    }

  return (
    <main>
      <h2>Editar Produtos</h2>
      <div>
        <form onSubmit={handleSubmit(handleUpdateProduto)}>
       <fieldset>
            <legend>Dados do Produto</legend>
            <div>
              <label htmlFor="nomeProduto">Nome Produto </label>
              <input type="text"  {...register("nome", {required: "Preenchimento do campo é obrigatório!", minLength:{value:3, message:"O campo deve conter no mínimo 3 caracteres!"}} )}/>
              {errors.nome && <span style={{color:"#ff0000"}}>{errors.nome.message}</span> }
            </div>
            <div>
              <label htmlFor="preco">Preço R$ </label>
              <input type="number" step={0.1} {...register("preco",{required: "Preenchimento do campo é obrigatório!", min:{value:1,message:"O valor minímo é 1"}})}/>
              {errors.preco && <span style={{color:"#ff0000"}}>{errors.preco.message}</span> }
            </div>            
            <div>
              <label htmlFor="estoque">Estoque </label>
              <input type="number" step={1} {...register("estoque",{required: "Preenchimento do campo é obrigatório!", min:{value:1,message:"O valor minímo é 1"}})}/>
              {errors.estoque && <span style={{color:"#ff0000"}}>{errors.estoque.message}</span> }
            </div>            
            <div>
              <button type="submit">Editar</button>
            </div>
          </fieldset>
        </form>
      </div>
    </main>
  )
}


