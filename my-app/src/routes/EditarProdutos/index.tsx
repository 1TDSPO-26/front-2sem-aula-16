import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import type { TipoProdutoJ } from "../../types/types";
import { useForm } from "react-hook-form";

export default function EditarProdutos() {
  //Modificar o título da página;
  document.title = "Editar Produtos";

  const navigate = useNavigate();

  //Declarando os componentes do hookForm
  const{register,handleSubimit,setValue,reset, formState:{errors}} = useForm<TipoProdutoJ>({
    defaultValues:{ id: "", nome: "", preco: 0, estoque: 0,avatar: "" },mode:"onBlur"});

    //Recuperar o parâmetro da rota através do hook useParams, desestruturando o objeto.
    const { id } = useParams<{id:string}>();

      //Criando o recipiente da lista de dados e tipando com o tipo de produto
    const [produto, setProduto] = useState<TipoProdutoJ>({ id: "", nome: "", preco: 0, estoque: 0,avatar: "" });

    useEffect(() => {
        //Simulando a requisição para o backend

        const carregaProduto = async () => {

            try {

                const resposta = await fetch(`http://localhost:3001/produtos/${id}`);

                if (!resposta.ok) {
                    throw new Error(`Produto não encontrado: ${resposta.status} - ${resposta.statusText}`)
                }

                const data: TipoProdutoJ = await resposta.json();
                console.log(data);
                setProduto(data);
                reset(data);

            } catch (error) {
                console.error(error);
            }
        }

        carregaProduto();

    }, []);


    const handleUpdate = async ()=>{
      try {

        const response = await fetch(`http://localhost:3001/produtos/${produto.id}` , {
          method:"PUT",
          headers:{
            "Content-Type": "application/json"
          },
          body: JSON.stringify(produto)
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
        <form>
          <fieldset>
            <legend>Dados do Produto</legend>
            <div>
              <label htmlFor="nomeProduto">Nome Produto </label>
              <input type="text" {...register("nome", {required: "Informe os dados do produto", minLength:{value:3, message:"O campo deve conter no mínimo 3 caracteres!"}} )}/>
              {errors.nome && <span style={{color:"#ff0000"}}>{errors.nome.message}</span> }
            </div>
            <div>
              <label htmlFor="preco">Preço R$ </label>
              <input type="number" name="preco" id="preco" value={produto.preco} onChange={e=> setProduto({...produto, preco: parseInt(e.target.value)})}/>
            </div>            
            <div>
              <label htmlFor="estoque">Em estoque </label>
              <input type="number" name="estoque" id="estoque" value={produto.estoque} onChange={e=> setProduto({...produto, estoque: parseInt(e.target.value)})}/>
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
