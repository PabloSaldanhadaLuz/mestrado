"use client";

import Main from "@/components/Main";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [avaliacoes, setAvaliacoes] = useState([]);

  useEffect(() => {
    const fetchForms = async () => {
      const response = await fetch("/api/avaliacoes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setAvaliacoes(data);
      console.log(data);
    };
    fetchForms();
  }, []);
  return (
    <Main>
      <section className="flex flex-col items-center justify-center h-screen bg-[var(--blue)] text-black">
        <section className="max-w-[700px] mx-auto p-4 bg-white rounded shadow-md grid grid-cols-1">
          {avaliacoes.length > 0 ? (
            avaliacoes.map((avaliacao: any) => (
              <Link
                href={`/avaliacoes/${avaliacao.id}`}
                key={avaliacao.id}
                className="transition-colors duration-200 ease-in-out mb-4 p-4 border-2 border-gray-200 rounded-xl hover:bg-gray-200 flex items-center justify-between"
              >
                <h2 className="text-2xl font-bold mb-2">
                  Grupo: {avaliacao.grupo}
                </h2>

                <hr className="w-0 h-[100px] mx-5 border border-gray-200"/>

                <div>
                  <p className="text-lg">
                    <span className="font-bold">Tema</span>: {avaliacao.tema}
                  </p>
                  <p className="text-lg">
                    <span className="font-bold">Estudantes</span>:{" "}
                    {avaliacao.estudantes}
                  </p>
                  <p className="text-lg">
                    <span className="font-bold">
                      Sugestão de conceito final
                    </span>
                    :{" "}
                    <span className="text-[var(--blue)] font-bold">
                      {avaliacao.conceitoFinal}
                    </span>
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center text-xl font-semibold">
              Nenhuma avaliação encontrada.
            </div>
          )}
          <Link
            href="/criar-avaliacao"
            className="text-center mt-4 bg-[var(--blue)] text-white py-2 px-4 rounded hover:bg-[var(--blue)]"
          >
            Criar nova avaliação
          </Link>
        </section>
      </section>
    </Main>
  );
}
