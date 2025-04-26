import { NextResponse } from "next/server";
import prisma from "../../../../prisma";

export async function GET(request: Request) {
  try {
    const forms = await prisma.form.findMany({
      include: { Etapas: true }, // Inclui as etapas relacionadas
    });

    return NextResponse.json(forms, {status: 200}); // HTTP 200 (OK)
  } catch (error) {
    console.error("Erro ao buscar avaliações:", error);
    return NextResponse.json({ error: "Falha ao buscar avaliações" }, {status: 500}); // HTTP 500 (Internal Server Error)
  }
}

export async function POST(request: Request) {
  try {
    const { grupo, tema, estudantes, conceitoFinal, observacoes, etapas } =
      await request.json();

    const formCriado = await prisma.form.create({
      data: {
        grupo,
        tema,
        estudantes,
        observacoes,
        conceitoFinal,
        Etapas: {
          // Criar as Etapas relacionadas em uma única operação
          create: etapas.map((etapa: any) => ({
            pergunta1: etapa.pergunta1,
            pergunta2: etapa.pergunta2,
            pergunta3: etapa.pergunta3,
            pergunta4: etapa.pergunta4,
            pergunta5: etapa.pergunta5,
          })),
        },
      },
      include: { Etapas: true }, // Retorna o Form com as Etapas criadas
    });

    return NextResponse.json(formCriado, {status: 201}); // HTTP 201 (Created)
  } catch (error) {
    console.error("Erro ao salvar no banco:", error);
    return NextResponse.json({ error: "Falha ao salvar avaliação" }, {status: 500}); // HTTP 500 (Internal Server Error)
  }
}
