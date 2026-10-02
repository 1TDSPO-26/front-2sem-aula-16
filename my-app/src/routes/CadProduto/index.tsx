import { useForm } from "react-hook-form";
import type { TipoProdutoJ } from "../../types/types";
import { useNavigate } from "react-router";
import { useState, type ChangeEvent } from "react";

export default function CadProduto() {

    document.title = "Cadastrar Produtos";
    const navigate = useNavigate();

    //RECIPIENTE DA IMAGEM
    const[lendoImagem, setLendoImagem] = useState<boolean>(false);

    const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<TipoProdutoJ>({
        defaultValues: { id: "", nome: "", preco: 0, estoque: 0, avatar: "" }, mode: "onChange"
    });

    const imagem = watch("avatar");

    const onSubmit = async (data: TipoProdutoJ) => {
        try {

            if(lendoImagem){
                alert("Aguarde a leitura da imagem!");
                return;
            }

            if(!data.avatar){
                alert("Selecione uma imagem para o produto!")
            }

            const response = await fetch(`http://localhost:3001/produtos/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`o cadastro falhou: ${response.status} - ${response.statusText}`)
            }

            //MSG de SUCESSO
            alert("Cadastro realizado com sucesso!");
            //Redirecionando para a página de produtos
            navigate("/produtos");

        } catch (error) {
            console.error(error);
        }
    }

    const selecionaImagem = (event:ChangeEvent<HTMLInputElement>) => {

        const arquivo = event.target.files?.[0];

        if(!arquivo){
            return;
        }

        if(!arquivo.type.startsWith("image/")){
            alert("Selecione um arquivo de imagem!");
            event.target.value = "";
            return;
        }

        if(arquivo.size > 1024 * 1024){
            alert("A imagem deve ter no máximo 1 MB!");
            event.target.value = "";
            return;
        }

        const leitor =  new FileReader();
        
        setLendoImagem(true);

        leitor.onload = () => {
            if(typeof leitor.result === "string"){
                setValue("avatar", leitor.result, 
                {
                shouldDirty:true,
                shouldValidate:true
                })
            }
            setLendoImagem(false);
        }

        leitor.onerror = () =>{
            alert("Não foi possível ler a imagem!")
            setLendoImagem(false);
        }

        leitor.readAsDataURL(arquivo);

    } 

    return (
        <main>
            <h2>Cadastro de Produtos</h2>
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <fieldset>
                        <legend>Dados do Produto</legend>
                        <div>
                            <label htmlFor="nomeProduto">Nome Produto </label>
                            <input type="text" {...register("nome", { required: "Preenchimento do campo é obrigatório!", minLength: { value: 3, message: "O campo deve conter no mínimo 3 caracteres!" } })} />
                            {errors.nome && <span style={{ color: "#ff0000" }}>{errors.nome.message}</span>}
                        </div>
                        <div>
                            <label htmlFor="preco">Preço R$ </label>
                            <input type="number" step={0.1} {...register("preco", { required: "Preenchimento do campo é obrigatório!", min: { value: 1, message: "O valor mínimo é 1" } })} />
                            {errors.preco && <span style={{ color: "#ff0000" }}>{errors.preco.message}</span>}
                        </div>
                        <div>
                            <label htmlFor="estoque">Em estoque </label>
                            <input type="number" step={1} {...register("estoque", { required: "Preenchimento do campo é obrigatório!", min: { value: 1, message: "O valor mínimo é 1" } })} />
                            {errors.estoque && <span style={{ color: "#ff0000" }}>{errors.estoque.message}</span>}
                        </div>

                        <div>
                            <label htmlFor="arquivoImg">Avatar Produto</label>
                            <input type="file" accept="image/" onChange={selecionaImagem} disabled={lendoImagem} />
                            <input type="hidden" {...register("avatar")}/>
                            {lendoImagem && <p>Lendo imagem...</p>}

                            {imagem && (
                                <div>
                                    <img 
                                    src={imagem}
                                    alt="Prévia da imagem do produto!"
                                    width={40}
                                    />
                                </div>
                            )}
                        </div>
                        <div>
                            <button type="submit" disabled={lendoImagem || isSubmitting}>Cadastrar</button>
                        </div>
                    </fieldset>
                </form>
            </div>
        </main>
    )
}