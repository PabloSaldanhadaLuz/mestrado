export const etapas = {
  "Etapa I - Escolha do Tema": [
    "O tema foi de interesse de todo o grupo?",
    "Houve diálogo no grupo para a escolha do tema?",
    "O tema foi coerente com a faixa etária do grupo?",
    "O tema foi próximo da realidade dos estudantes?",
    "O tema agregou no ensino e aprendizagem deste grupo na SRM (habilidade de socialização)?",
  ],
  "Etapa II - Pesquisa Exploratória": [
    "Os dados foram obtidos de fontes confiáveis?",
    "A pesquisa teve relação ao tema escolhido pelo grupo?",
    "Houve participação de todos os integrantes do grupo na pesquisa exploratória?",
    "O grupo se dedicou a fazer esta pesquisa, teve recursos bibliográficos ou pesquisa de campo?",
    "A pesquisa exploratória agregou no ensino e aprendizagem de matemática deste grupo na SRM (habilidade de organização e planejamento)?",
  ],
  "Etapa III - Levantamento do(s) Problema(s)": [
    "Os problemas levantados tiveram correlação coerente ao tema escolhido?",
    "Os alunos estavam interessados em responder a esses problemas levantados?",
    "Os problemas são relacionados à cultura e vivência do grupo?",
    "Os conteúdos matemáticos podem ser trabalhados com os problemas levantados?",
    "Os levantamentos dos problemas agregaram no ensino e aprendizagem deste grupo na SRM (habilidade de problematizar)?",
  ],
  "Etapa IV - Resolução do(s) Problema(s) e Desenvolvimento do Conteúdo Matemático":
    [
      "A resolução inicial dos alunos foi coerente com a pesquisa exploratória?",
      "Houve modelo matemático? Se sim, este modelo foi coerente com uma possível resolução para um ou mais problemas levantados?",
      "O conteúdo matemático trabalhado auxiliou na resolução desse(s) problema(s)?",
      "Teve empenho do grupo ao responder esses problemas e ao descobrir o conteúdo matemático, caso houvesse?",
      "A resolução dos problemas agregou no ensino e aprendizagem de matemática deste grupo na SRM (habilidade de mobilizar conhecimentos sobre conteúdos específicos)?",
    ],
  "Etapa V - Análise Crítica da(s) Solução(ões)": [
    "A análise crítica das soluções foi coerente com o processo de modelagem matemática?",
    "A apresentação das soluções teve participação geral do grupo?",
    "Esta análise levou em conta todas as outras etapas, sendo coerente com o tema, pesquisa exploratória, levantamento e resoluções?",
    "Os conteúdos matemáticos apresentados na análise foram coerentes com as resoluções dos problemas apresentados?",
    "A análise crítica agregou no ensino e aprendizagem deste grupo na SRM (habilidades de comunicação e trabalho em equipe)?",
  ],
};

export default function Etapa({
  nome,
  perguntas,
  respostas,
  onRespostaChange,
}: {
  nome: string;
  perguntas: string[];
  respostas: Record<string, string>;
  onRespostaChange: (nome: string, index: number, opcao: string) => void;
}) {
  return (
    <div className="mb-8 border border-gray-200 rounded-lg p-4">
      <h3 className="text-xl font-semibold mb-4">{nome}</h3>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left pb-2">Pergunta</th>
            <th className="w-10">A</th>
            <th className="w-10">B</th>
            <th className="w-10">C</th>
            <th className="w-10">D</th>
          </tr>
        </thead>
        <tbody>
          {perguntas.map((pergunta, index) => {
            // Corrigindo o índice para começar em 0 para cada etapa
            const respostaKey = `${nome}_${index}`;
            return (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-3">{pergunta}</td>
                {["A", "B", "C", "D"].map((opcao) => (
                  <td key={opcao} className="text-center">
                    <input
                      type="radio"
                      name={respostaKey}
                      checked={respostas[respostaKey] === opcao}
                      onChange={() => onRespostaChange(nome, index, opcao)}
                      className="h-4 w-4"
                    />
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
