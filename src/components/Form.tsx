"use client";

import Etapa, { etapas } from "./EtapasAvaliacao/Etapa";
import InputText from "./InputText";
import { useState } from "react";

interface Respostas {
  [key: string]: string;
}

interface FormValues {
  grupo: string;
  tema: string;
  estudantes: string;
  observacoes: string;
}

interface EtapaParaEnviar {
  pergunta1: string;
  pergunta2: string;
  pergunta3: string;
  pergunta4: string;
  pergunta5: string;
}

interface HandleRespostaChange {
  (etapaNome: string, perguntaIndex: number, valor: string): void;
}

export default function Form() {
  const [respostas, setRespostas] = useState<Respostas>({});
  const [formValues, setFormValues] = useState<FormValues>({
    grupo: "",
    tema: "",
    estudantes: "",
    observacoes: "",
  });
  const [conceitoFinal, setConceitoFinal] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRespostaChange: HandleRespostaChange = (
    etapaNome,
    perguntaIndex,
    valor
  ) => {
    setRespostas((prev) => ({
      ...prev,
      [`${etapaNome}_${perguntaIndex}`]: valor,
    }));
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

  const salvarAvaliacao = async (conceitoFinal: string) => {
    setIsSubmitting(true);
    
    try {
      // Organizar as respostas por etapa
      const etapasRespostas: Record<string, string[]> = {};

      Object.entries(respostas).forEach(([key, value]) => {
        const [etapaNome, perguntaIndex] = key.split("_");
        if (!etapasRespostas[etapaNome]) {
          etapasRespostas[etapaNome] = [];
        }
        etapasRespostas[etapaNome][parseInt(perguntaIndex)] = value;
      });

      // Transformar no formato esperado pelo backend
      const etapasParaEnviar: EtapaParaEnviar[] = Object.keys(etapasRespostas).map((etapaNome) => {
        const respostasDaEtapa = etapasRespostas[etapaNome];
        return {
          pergunta1: respostasDaEtapa[0] || "",
          pergunta2: respostasDaEtapa[1] || "",
          pergunta3: respostasDaEtapa[2] || "",
          pergunta4: respostasDaEtapa[3] || "",
          pergunta5: respostasDaEtapa[4] || "",
        };
      });

      // Verificar se todos os campos obrigatórios foram preenchidos
      if (!formValues.grupo || !formValues.tema || !formValues.estudantes) {
        throw new Error("Por favor, preencha todos os campos obrigatórios");
      }

      // Enviar para o backend
      const response = await fetch("/api/avaliacoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formValues,
          conceitoFinal,
          etapas: etapasParaEnviar,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar avaliação");
      }

      const resultado = await response.json();
      alert("Avaliação salva com sucesso!");
      return resultado;
    } catch (error) {
      console.error("Erro ao salvar avaliação:", error);
      alert("Erro ao salvar avaliação: " + (error instanceof Error ? error.message : "Erro desconhecido"));
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!conceitoFinal) {
      alert("Por favor, calcule o conceito final antes de enviar");
      return;
    }

    try {
      await salvarAvaliacao(conceitoFinal);
      // Limpar formulário após envio bem-sucedido
      setRespostas({});
      setFormValues({
        grupo: "",
        tema: "",
        estudantes: "",
        observacoes: "",
      });
      setConceitoFinal("");

      window.location.href = "/home";
    } catch (error) {
      // O erro já foi tratado na função salvarAvaliacao
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormValues((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <form
      className="max-w-[700px] mx-auto p-4 bg-white rounded shadow-md"
      onSubmit={handleSubmit}
    >
      <h2 className="text-3xl font-bold text-center pb-10">
        Avaliação da Prática de Modelagem Matemática
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

      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={calcularModa}
          className="cursor-pointer px-4 py-2 bg-[var(--blue)] text-white rounded"
          disabled={isSubmitting}
        >
          Calcular Conceito Final
        </button>

        {conceitoFinal && (
          <div className="text-lg font-semibold">
            Conceito Final:{" "}
            <span className="text-[var(--blue)]">{conceitoFinal}</span>
          </div>
        )}
      </div>

      <button
        type="submit"
        className="cursor-pointer transition-colors duration-200 ease-in-out w-full mt-6 px-4 py-3 bg-white text-[var(--blue)] border-2 border-[var(--blue)] rounded hover:text-white hover:bg-[var(--blue)] font-medium"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Enviando..." : "Salvar Avaliação"}
      </button>
    </form>
  );
}