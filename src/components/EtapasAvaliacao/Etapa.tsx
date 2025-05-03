export const etapas = {
  "Etapa I - Escolha do Tema": [
    "O tema foi de interesse de todo o grupo?",
    "Houve diálogo no grupo para a escolha do tema?",
    "O tema foi coerente com a faixa etária, nível de conhecimento ou realidade do grupo?",
    "Nada",
    "A escolha do tema, colaborou com o desenvolvimento da habilidade de socialização, colaboração e comunicação do grupo?",
  ],
  "Etapa II - Pesquisa Exploratória": [
    "A pesquisa apresentou qualidade e profundidade adequada nas informações coletadas?",
    "A pesquisa teve relação ao tema escolhido pelo grupo?",
    "O grupo demonstrou curiosidade e iniciativa ao realizar a pesquisa?",
    "Houve envolvimento do grupo na pesquisa, com uso de fontes bibliográficas ou pesquisa de campo?",
    "A pesquisa exploratória colaborou com o desenvolvimento da habilidade de organização e planejamento do grupo?",
  ],
  "Etapa III - Levantamento do(s) Problema(s)": [
    "Os problemas levantados tiveram correlação coerente ao tema escolhido?",
    "Os conteúdos matemáticos podem ser trabalhados com os problemas levantados?",
    "Os problemas apresentaram um nível de complexidade adequado para a faixa etária, nível de conhecimento ou realidade do grupo?",
    "O grupo demonstrou curiosidade em investigar e resolver os problemas levantados?",
    "Os levantamentos dos problemas colaboraram com o desenvolvimento da habilidade de problematização do grupo?",
  ],
  "Etapa IV - Resolução do(s) Problema(s) e Desenvolvimento do Conteúdo Matemático":
    [
      "A resolução inicial dos alunos foi coerente com a pesquisa exploratória?",
      "Houve modelo matemático? Se sim, este modelo foi coerente tendo um nível de complexidade adequado para a faixa etária, nível de conhecimento ou realidade do grupo?",
      "O conteúdo matemático trabalhado auxiliou na resolução desse(s) problema(s)?",
      "Teve empenho e colaboração do grupo para responder os problemas e ao descobrir o conteúdo matemático, caso houvesse?",
      "A resolução dos problemas colaborou com o desenvolvimento da habilidade de mobilizar conhecimentos sobre conteúdos específicos e criatividade?",
    ],
  "Etapa V - Análise Crítica da(s) Solução(ões)": [
    "A análise crítica das soluções foi coerente com o processo de modelagem matemática?",
    "A apresentação das soluções contou com a colaboração do grupo, mesmo que nem todos tenham apresentado oralmente?",
    "Esta análise levou em conta todas as outras etapas, sendo coerente com o tema, pesquisa exploratória, levantamento e resoluções?",
    "Os conteúdos matemáticos apresentados na análise foram coerentes com as resoluções dos problemas apresentados?",
    "A Análise crítica colaborou com o desenvolvimento das habilidades de comunicação, argumentação, trabalho em equipe e criticidade?",
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
