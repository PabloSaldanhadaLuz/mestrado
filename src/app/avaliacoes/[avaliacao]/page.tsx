"use client";

import Main from "@/components/Main";
import Etapa, { etapas } from "../../../components/EtapasAvaliacao/Etapa";
import InputText from "../../../components/InputText";
import { useState, useEffect, use } from "react";
import { FaTrashAlt } from "react-icons/fa";

interface Resposta {
  [key: string]: string;
}

interface FormValues {
  grupo: string;
  tema: string;
  estudantes: string;
  observacoes: string;
}

interface EtapaParaEnviar {
  id?: string;
  pergunta1: string;
  pergunta2: string;
  pergunta3: string;
  pergunta4: string;
  pergunta5: string;
}

interface AvaliacaoData {
  _id: string;
  grupo: string;
  tema: string;
  estudantes: string;
  observacoes: string;
  conceitoFinal: string;
  Etapas: EtapaParaEnviar[];
  createdAt: string;
  updatedAt: string;
}

export default function Form({
  params,
}: {
  params: Promise<{ avaliacao: string }>;
}) {
  const { avaliacao } = use(params);

  const [respostas, setRespostas] = useState<Resposta>({});
  const [formValues, setFormValues] = useState<FormValues>({
    grupo: "",
    tema: "",
    estudantes: "",
    observacoes: "",
  });
  const [conceitoFinal, setConceitoFinal] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [etapasIds, setEtapasIds] = useState<Record<number, string>>({}); // Mapeia índice para ID

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/avaliacoes/${avaliacao}`);
        if (!response.ok) {
          throw new Error("Erro ao buscar avaliação");
        }
        const data: AvaliacaoData = await response.json();

        setFormValues({
          grupo: data.grupo,
          tema: data.tema,
          estudantes: data.estudantes,
          observacoes: data.observacoes || "",
        });

        setConceitoFinal(data.conceitoFinal);

        const respostasFormatadas: Resposta = {};
        const ids: Record<number, string> = {};

        data.Etapas.forEach((etapa: any, etapaIndex) => {
          const etapaNome = Object.keys(etapas)[etapaIndex];
          ids[etapaIndex] = etapa.id;

          // Mapeia pergunta1 a etapaNome_0, pergunta2 a etapaNome_1, etc.
          [
            "pergunta1",
            "pergunta2",
            "pergunta3",
            "pergunta4",
            "pergunta5",
          ].forEach((perguntaKey, index) => {
            if (etapa[perguntaKey]) {
              respostasFormatadas[`${etapaNome}_${index}`] = String(
                etapa[perguntaKey]
              );
            }
          });
        });

        console.log("Respostas formatadas:", respostasFormatadas); // Depuração
        setRespostas(respostasFormatadas);
        setEtapasIds(ids);
      } catch (error) {
        console.error("Erro ao buscar avaliação:", error);
        alert("Erro ao carregar avaliação");
      } finally {
        setIsLoading(false);
      }
    };

    if (avaliacao) {
      fetchData();
    }
  }, [avaliacao]);

  const handleRespostaChange = (
    etapaNome: string,
    perguntaIndex: number,
    valor: string
  ) => {
    console.log(`Atualizando ${etapaNome}_${perguntaIndex} para: ${valor}`);
    setRespostas((prev) => {
      const newRespostas = {
        ...prev,
        [`${etapaNome}_${perguntaIndex}`]: valor,
      };
      console.log("Novo estado respostas:", newRespostas); // Depuração
      return newRespostas;
    });
  };

  const calcularModa = () => {
    const contagem = { A: 0, B: 0, C: 0, D: 0 };

    Object.values(respostas).forEach((resposta) => {
      if (resposta && typeof resposta === "string" && resposta in contagem) {
        contagem[resposta as keyof typeof contagem]++;
      }
    });

    const moda = Object.keys(contagem).reduce((a, b) =>
      contagem[a as keyof typeof contagem] >=
      contagem[b as keyof typeof contagem]
        ? a
        : b
    );

    setConceitoFinal(moda);
    alert(`O conceito final da avaliação é: ${moda}`);
  };

  const deleteAvaliacao = async () => {
    if (confirm("Você tem certeza que deseja excluir esta avaliação?")) {
      try {
        const response = await fetch(`/api/avaliacoes/${avaliacao}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao excluir avaliação");
        }

        alert("Avaliação excluída com sucesso!");
        window.location.href = "/home";
      } catch (error) {
        console.error("Erro ao excluir avaliação:", error);
        alert(
          "Erro ao excluir avaliação: " +
            (error instanceof Error ? error.message : "Erro desconhecido")
        );
      }
    }
  };

  const salvarAvaliacao = async () => {
    setIsSubmitting(true);

    try {
      const etapasParaEnviar: EtapaParaEnviar[] = Object.entries(etapas).map(
        ([etapaNome, perguntas], index) => {
          const etapaRespostas: EtapaParaEnviar = {
            id: etapasIds[index], // Atribui um ID temporário se não existir
            pergunta1: "",
            pergunta2: "",
            pergunta3: "",
            pergunta4: "",
            pergunta5: "",
          };

          perguntas.forEach((_, perguntaIndex) => {
            const respostaKey = `${etapaNome}_${perguntaIndex}`;
            etapaRespostas[
              `pergunta${perguntaIndex + 1}` as keyof EtapaParaEnviar
            ] = respostas[respostaKey] || "";
          });

          console.log(`Etapa ${etapaNome} para enviar:`, etapaRespostas);
          return etapaRespostas;
        }
      );

      console.log("Payload completo:", {
        id: avaliacao,
        ...formValues,
        conceitoFinal,
        etapas: etapasParaEnviar,
      });

      if (!formValues.grupo || !formValues.tema || !formValues.estudantes) {
        throw new Error("Por favor, preencha todos os campos obrigatórios");
      }

      console.log(formValues);

      const response = await fetch(`/api/avaliacoes/${avaliacao}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: avaliacao,
          ...formValues,
          conceitoFinal,
          etapas: etapasParaEnviar,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar avaliação");
      }

      const resultado = await response.json();
      console.log("Resposta do backend:", resultado);
      alert("Avaliação atualizada com sucesso!");
      return resultado;
    } catch (error) {
      console.error("Erro ao salvar avaliação:", error);
      alert(
        "Erro ao salvar avaliação: " +
          (error instanceof Error ? error.message : "Erro desconhecido")
      );
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await salvarAvaliacao();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormValues((prev) => ({ ...prev, [id]: value }));
  };

  if (isLoading) {
    return (
      <Main>
        <div className="max-w-[700px] mx-auto p-4 bg-white rounded shadow-md text-center">
          <p>Carregando avaliação...</p>
        </div>
      </Main>
    );
  }

  return (
    <Main>
      <form
        className="max-w-[700px] mx-auto p-4 bg-white rounded shadow-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-bold text-center pb-10">
          {avaliacao ? "Editar Avaliação" : "Nova Avaliação"}
        </h2>

        <section className="mb-8">
          <InputText
            label="Grupo"
            id="grupo"
            value={formValues.grupo}
            onChange={handleInputChange}
          />
          <InputText
            label="Tema"
            id="tema"
            value={formValues.tema}
            onChange={handleInputChange}
          />
          <InputText
            label="Estudantes"
            id="estudantes"
            value={formValues.estudantes}
            onChange={handleInputChange}
          />
        </section>

        <h2 className="text-3xl font-bold text-center pb-10">
          Etapas de Avaliação
        </h2>

        <section className="mb-8">
          {Object.entries(etapas).map(([nome, perguntas], index) => (
            <Etapa
              key={index}
              nome={nome}
              perguntas={perguntas}
              respostas={respostas}
              onRespostaChange={handleRespostaChange}
            />
          ))}
        </section>

        <section className="mb-4">
          <label htmlFor="observacoes" className="block mb-2 font-medium">
            Observações
          </label>
          <textarea
            id="observacoes"
            value={formValues.observacoes}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            rows={3}
          />
        </section>

        <div className="flex p-2 justify-between items-center">
          <button
            type="button"
            onClick={calcularModa}
            className="cursor-pointer px-4 py-2 bg-[var(--blue)] text-white rounded"
            disabled={isSubmitting}
          >
            Calcular Conceito Final
          </button>

          {conceitoFinal && (
            <div className="text-lg p-2 font-semibold">
              Conceito Final:{" "}
              <span className="text-[var(--blue)]">{conceitoFinal}</span>
            </div>
          )}
        </div>

        <section className="flex items-center justify-between mt-6 gap-2">
          <button
            type="submit"
            className="cursor-pointer transition-colors duration-200 ease-in-out w-full mt-6 px-4 py-3 bg-white text-[var(--blue)] border-2 border-[var(--blue)] rounded hover:text-white hover:bg-[var(--blue)] font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Salvando..." : "Salvar Alterações"}
          </button>

          <button
            type="button"
            onClick={deleteAvaliacao}
            className="cursor-pointer transition-colors duration-200 ease-in-out w-1/6 mt-6 px-4 py-3 bg-white text-red-500 border-2 border-red-500 rounded hover:text-white hover:bg-red-500 font-medium"
          >
            <FaTrashAlt className="inline mr-2" />
          </button>
        </section>
      </form>
    </Main>
  );
}
