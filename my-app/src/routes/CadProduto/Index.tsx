import { useForm } from "react-hook-form";
import type { TipoProdutoJson } from "../../types/types";
import { useNavigate } from "react-router";
import { useState, type ChangeEvent } from "react";

export default function CadProduto() {

      //Modificar o título da página;
  document.title = "Cadastrar Produtos";
  const navigate = useNavigate();

  //RECIPIENTE DA IMAGEM
  const [lendoImagem, setLendoImagem] = useState<boolean>(false);
  const [previewImagem, setPreviewImagem] = useState<string>("");

  //Declarando os componentes do hookForm
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<TipoProdutoJson>({
    defaultValues: { id: "", nome: "", preco: 0, estoque: 0, avatar: "" },
    mode: "onChange"
  });
  const handleUpdate = async (data: TipoProdutoJson) => {
    try {
      const { id: _id, ...produto } = data;

      const response = await fetch("http://localhost:3001/produtos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...produto,
          nome: produto.nome.trim()
        })
      });

      if (!response.ok) {
        throw new Error(`O cadastro falhou: ${response.status} - ${response.statusText}`);
      }

      alert("Cadastro realizado com sucesso!");
      navigate("/produtos");

    } catch (error) {
      console.error("Erro ao cadastrar produto:", error);
      alert("Não foi possível cadastrar o produto. Verifique se a API está ligada.");
    }
  };

  const selecionaImagem = (event: ChangeEvent<HTMLInputElement>): void => {

      const arquivo = event.target.files?.[0];

      if (!arquivo) {
        return;
      }

      if (!arquivo.type.startsWith("image/")) {
        alert("Selecione um arquivo de imagem!");
        event.target.value = "";
        return;
      }

      if (arquivo.size > 1024 * 1024) {
        alert("A imagem deve ter no máximo 1 MB!");
        event.target.value = "";
        return;
      }

      setLendoImagem(true);
      const urlImagem = URL.createObjectURL(arquivo);
      setPreviewImagem(urlImagem);
      setValue("avatar", arquivo.name, {
        shouldDirty: true,
        shouldValidate: true
      });
      setLendoImagem(false);
  };

  return (
    <main>
        <h2>Cadastro de Produtos</h2>
        <div>
        <form onSubmit={handleSubmit(handleUpdate)}>
          <fieldset>
            <legend>Dados do Produto</legend>
            <div>
              <label htmlFor="nomeProduto">Nome Produto </label>
              <input type="text" {...register("nome", {
                required: "Preenchimento do campo é obrigatório!",
                setValueAs: (value: string) => value.trim(),
                minLength: { value: 3, message: "O campo deve conter no mínimo 3 caracteres!" },
                maxLength: { value: 100, message: "O campo deve conter no máximo 100 caracteres!" }
              })} />
              {errors.nome && <span style={{ color: "#ff0000" }}>{errors.nome.message}</span>}
            </div>
            <div>
              <label htmlFor="preco">Preço R$ </label>
              <input type="number" step={0.01} {...register("preco", {
                required: "Preenchimento do campo é obrigatório!",
                valueAsNumber: true,
                min: { value: 0.01, message: "O preço deve ser maior que zero!" },
                validate: (value) => Number.isFinite(value) || "Informe um preço válido!"
              })} />
              {errors.preco && <span style={{ color: "#ff0000" }}>{errors.preco.message}</span>}
            </div>            
            <div>
              <label htmlFor="estoque">Estoque </label>
              <input type="number" step={1} {...register("estoque", {
                required: "Preenchimento do campo é obrigatório!",
                valueAsNumber: true,
                min: { value: 0, message: "O estoque não pode ser negativo!" },
                validate: (value) => Number.isInteger(value) || "O estoque deve ser um número inteiro!"
              })} />
              {errors.estoque && <span style={{ color: "#ff0000" }}>{errors.estoque.message}</span>}
            </div>            
            <div>
              <label htmlFor="avatar">Imagem </label>
              <input type="hidden" {...register("avatar", {
                required: "Selecione uma imagem!"
              })} />
              <input id="avatar" type="file" accept="image/*" onChange={selecionaImagem} />
              {lendoImagem && <span>Carregando imagem...</span>}
              {errors.avatar && <span style={{ color: "#ff0000" }}>{errors.avatar.message}</span>}
              {previewImagem && <img src={previewImagem} alt="Pré-visualização do produto" width={120} />}
            </div>
            <div>
              <button type="submit" disabled={isSubmitting || lendoImagem}>
                {isSubmitting ? "Cadastrando..." : "Cadastrar"}
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </main>
  )
}
