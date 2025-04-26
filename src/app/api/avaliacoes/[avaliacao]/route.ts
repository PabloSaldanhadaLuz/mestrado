import { NextResponse } from "next/server";
import prisma from "../../../../../prisma";

export async function GET(
  request: Request,
  { params }: { params: { avaliacao: string } }
) {
  const { avaliacao } = await params;
  try {
    const forms = await prisma.form.findFirst({
      where: { id: avaliacao },
      include: { Etapas: true },
    });

    return NextResponse.json(forms, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar avaliações:", error);
    return NextResponse.json(
      { error: "Falha ao buscar avaliações" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, grupo, tema, estudantes, conceitoFinal, observacoes, etapas } =
      await request.json();

    console.log("Payload recebido no PATCH:", { id, grupo, tema, estudantes, observacoes, conceitoFinal, etapas });

    // Separar etapas para atualização (com id válido) e criação (com id undefined)
    const etapasParaAtualizar = etapas
      .filter((etapa: any) => etapa.id && etapa.id !== "undefined")
      .map((etapa: any) => ({
        where: { id: etapa.id },
        data: {
          pergunta1: etapa.pergunta1 || "",
          pergunta2: etapa.pergunta2 || "",
          pergunta3: etapa.pergunta3 || "",
          pergunta4: etapa.pergunta4 || "",
          pergunta5: etapa.pergunta5 || "",
        },
      }));

    const etapasParaCriar = etapas
      .filter((etapa: any) => !etapa.id || etapa.id === "undefined")
      .map((etapa: any) => ({
        pergunta1: etapa.pergunta1 || "",
        pergunta2: etapa.pergunta2 || "",
        pergunta3: etapa.pergunta3 || "",
        pergunta4: etapa.pergunta4 || "",
        pergunta5: etapa.pergunta5 || "",
      }));

    const formAtualizado = await prisma.form.update({
      where: { id },
      data: {
        grupo,
        tema,
        estudantes,
        observacoes, // Corresponde ao campo no schema
        conceitoFinal,
        Etapas: {
          update: etapasParaAtualizar,
          create: etapasParaCriar,
        },
      },
      include: { Etapas: true },
    });

    console.log("Form atualizado:", formAtualizado);
    return NextResponse.json(formAtualizado, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar avaliação:", error);
    return NextResponse.json(
      { error: "Falha ao atualizar avaliação" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: { avaliacao: string } }) {
  try {
    const formDeletado = await prisma.form.delete({
      where: { id: await params.avaliacao },
    });

    return NextResponse.json(formDeletado, { status: 200 });
  } catch (error) {
    console.error("Erro ao deletar avaliação:", error);
    return NextResponse.json(
      { error: "Falha ao deletar avaliação" },
      { status: 500 }
    );
  }
}