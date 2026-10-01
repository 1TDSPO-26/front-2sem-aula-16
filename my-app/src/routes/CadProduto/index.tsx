import { useForm } from "react-hook-form";
import type { TipoProdutoJ } from "../../types/types";
import { useNavigate } from "react-router";

export default function CadProduto() {

    document.title = "Cadastrar Produtos";
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<TipoProdutoJ>({
        defaultValues: { id: "", nome: "", preco: 0, estoque: 0, avatar: "" }, mode: "onChange"
    });

    const onSubmit = async (data: TipoProdutoJ) => {
        try {

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
                            <button type="submit">Cadastrar</button>
                        </div>
                    </fieldset>
                </form>
            </div>
        </main>
    )
}