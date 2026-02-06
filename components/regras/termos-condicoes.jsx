'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { 
  Scale, 
  Users, 
  MessageSquare, 
  HelpCircle, 
  ShoppingCart, 
  UserCheck,
  Gavel,
  Lock,
  Radio,
  FileText,
  AlertTriangle
} from 'lucide-react'

export default function TermosCondicoes() {
  return (
    <Card className="mb-6 border-2">
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl">Termos e Regras Aplicáveis ao Jogo</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Por favor, leia atentamente todos os tópicos abaixo, pois você poderá receber punições desnecessárias por desconhecer as regras. 
          Para mantermos a boa ordem do jogo, você deverá seguir regras específicas que listaremos abaixo. 
          Entretanto, pedimos que acima de qualquer regra, use o bom senso quando utilizar o jogo.
        </p>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          
          {/* Capítulo 1 - Comportamento Geral */}
          <AccordionItem value="cap1" className="border-2 rounded-lg mb-4 px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-blue-500" />
                <span className="font-bold text-lg">Capítulo 1 - Comportamento Geral</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <p className="text-sm text-muted-foreground italic">
                Regras gerais que regem as atitudes dos jogadores
              </p>
              
              <div className="space-y-4">
                <div className="border-l-4 border-red-500 pl-4 py-2">
                  <p className="font-semibold text-foreground mb-1">Art. 1.a - Destructive Behavior</p>
                  <p className="text-sm text-muted-foreground">
                    Apenas críticas construtivas são permitidas, críticas destrutivas pode acarretar em banimento do jogo. 
                    Atitudes anti-desportivas com intuito de atrapalhar outro jogador podem ser punidas (por exemplo: utilizar itens para prender outro jogador). 
                    Também é passivo de banimento aquele que utilizar de qualquer meio para atrapalhar os jogadores.
                  </p>
                </div>

                <div className="border-l-4 border-red-500 pl-4 py-2">
                  <p className="font-semibold text-foreground mb-1">Art. 1.b - Offensive Statement</p>
                  <p className="text-sm text-muted-foreground">
                    Ofensas a membros da staff não são permitidas, assim como calúnia e difamação, independente de quem se refere, pode acarretar em banimento do jogo. 
                    Reporte esse tipo de infração abrindo um report, se for comprovada a infração o jogador será punido. 
                    O player que envia mensagens ofensivas a outro player em PVT (privado) deve ser ignorado. 
                    Também é considerado calúnia o jogador que reporta de má fé um jogador por uma infração que não cometeu.
                  </p>
                </div>

                <div className="border-l-4 border-orange-500 pl-4 py-2">
                  <p className="font-semibold text-foreground mb-1">Art. 1.c - Offensive Statement/Destructive Behavior</p>
                  <p className="text-sm text-muted-foreground">
                    Discussões pessoais devem ser feitas por mensagem privada, não é permitido discutir nos canais públicos, isso pode acarretar em banimento do jogo.
                  </p>
                </div>

                <div className="border-l-4 border-purple-500 pl-4 py-2">
                  <p className="font-semibold text-foreground mb-1">Art. 1.d - Misrepresentation</p>
                  <p className="text-sm text-muted-foreground">
                    Não é permitido jogadores se comportarem ou passarem ter influência sobre Tutores, Gamemasters ou membros da equipe sendo que não possuem essa autoridade, 
                    podem acarretar em banimento do jogo.
                  </p>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4 py-2">
                  <p className="font-semibold text-foreground mb-1">Art. 1.e - Destructive Behavior/Contempt Authority</p>
                  <p className="text-sm text-muted-foreground">
                    Não é permitido discutir sobre as decisões tomadas pela equipe em público, se quiser reclamar sobre uma atitude tomada por um membro da equipe 
                    tanto como Tutor ou Gamemaster, deverá ser feito por email.
                  </p>
                </div>

                <div className="border-l-4 border-red-500 pl-4 py-2">
                  <p className="font-semibold text-foreground mb-1">Art. 1.f - Offensive Statement</p>
                  <p className="text-sm text-muted-foreground">
                    Jogadores que difamarem o jogo assim como seus criadores, idealizadores, colaboradores, jogadores, etc em outros serviços como Fóruns, Blogs, 
                    páginas pessoais, dentre outros, quando identificados poderão ser punidos.
                  </p>
                </div>

                <div className="border-l-4 border-red-500 pl-4 py-2">
                  <p className="font-semibold text-foreground mb-1">Art. 1.g - Misrepresentation (Falsidade Ideológica - Crime)</p>
                  <p className="text-sm text-muted-foreground">
                    Jogadores que criarem personagens com nome semelhante ao de Tutores, Gamemaster e membros da equipe serão banidos, 
                    isso é considerado Falsidade Ideológica e é crime.
                  </p>
                </div>

                <div className="border-l-4 border-red-500 pl-4 py-2">
                  <p className="font-semibold text-foreground mb-1">Art. 1.h - Game Weakness Abuse/Bug Abuse</p>
                  <p className="text-sm text-muted-foreground">
                    Abusar de fraquezas do jogo assim como bugs é considerado ilegal, se encontrar algum bug informe imediatamente para algum Gamemaster abrindo um report (Ctrl R). 
                    O jogador que se aproveitar de bugs será punido e quem souber de alguém abusando e manter em segredo, também poderá ser punido.
                  </p>
                </div>

                <div className="border-l-4 border-red-500 pl-4 py-2">
                  <p className="font-semibold text-foreground mb-1">Art. 1.i - Illegal Trade</p>
                  <p className="text-sm text-muted-foreground">
                    Vender, trocar, comprar a outro jogador, utilizando o jogo como meio de venda não é permitido, assim como comércio de itens e recursos deste jogo para outro jogo 
                    e vendas, trocas e compras de itens e recursos do jogo por dinheiro real. O jogador que infringir essas regras quando for identificado será punido.
                  </p>
                </div>

                <div className="border-l-4 border-red-500 pl-4 py-2">
                  <p className="font-semibold text-foreground mb-1">Art. 1.j - Illegal Software (Banimento Permanente)</p>
                  <p className="text-sm text-muted-foreground">
                    O uso de programas ilegais, ou seja, que não são oficiais e proporcionados pelo jogo (por exemplo: bot e macro) não é permitido, 
                    podendo acarretar em banimento permanente do jogo.
                  </p>
                </div>

                <div className="border-l-4 border-red-500 pl-4 py-2">
                  <p className="font-semibold text-foreground mb-1">Art. 1.k - Hacking/Unauthorized Link (Banimento Definitivo)</p>
                  <p className="text-sm text-muted-foreground">
                    É proibido a tentativa e o ato de roubar a conta de outro jogador, seja por pedir a conta e senha, enviar links falsos ou qualquer outra tentativa de obter informações da conta de jogador. 
                    Banimento definitivo e suspensão da conta.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2 font-semibold">
                    Parágrafo Único: Na mesma pena incorre quem postar links para programas Hacker, Cracks, BOT ou material ilícito. 
                    Além de seus dados serem encaminhados à Autoridade Policial.
                  </p>
                </div>

                <div className="border-l-4 border-orange-500 pl-4 py-2">
                  <p className="font-semibold text-foreground mb-1">Art. 1.l - Trap</p>
                  <p className="text-sm text-muted-foreground">
                    Impedir a passagem de um jogador, fazendo com que ele não consiga acessar o local pretendido é considerado ilegal e pode acarretar em banimento do jogo.
                  </p>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4 py-2">
                  <p className="font-semibold text-foreground mb-1">Art. 1.m - False Report/Destructive Report</p>
                  <p className="text-sm text-muted-foreground">
                    É proibído abrir reports destrutivos sem ser para reportar alguma infração de jogador e bugs. 
                    Outros tipos de report poderão ser considerados como Falso Report ou Report Destrutivo e pode acarretar em banimento do jogo.
                  </p>
                </div>

                <div className="border-l-4 border-red-500 pl-4 py-2">
                  <p className="font-semibold text-foreground mb-1">Art. 1.n - Pretending to Have Influence on Gamemaster</p>
                  <p className="text-sm text-muted-foreground">
                    Jogadores que tentarem ter influência sobre o cargo do Gamemaster, se dizer amigo dele, afirmar que o conhece para abuso de poder e ação de má fé, 
                    poderá ter a conta banida permanentemente.
                  </p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <p className="font-semibold text-foreground mb-1">Art. 1.o - Responsabilidade do Jogador</p>
                  <p className="text-sm text-muted-foreground">
                    Nós não nos responsabilizamos por roubos, ou seja, roubos caso você empreste algum poke, troque por engano, catch service, ou qualquer outro serviço onde você dependa da confiança de outro jogador.
                    Também não nos responsabilizamos por erros dos jogadores como jogar algum item no chão por engano e outro jogador pegar.
                  </p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <p className="font-semibold text-foreground mb-1">Art. 1.p - Prioridade no Suporte</p>
                  <p className="text-sm text-muted-foreground">
                    Em razão dos altos custos para manter o jogo on-line, terão prioridade no suporte as pessoas que contribuem para o desenvolvimento do jogo mediante doações. 
                    Se os valores recebidos mediante doação forem insuficientes para manter os servidores on-line, estes podem ser desligados.
                  </p>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4 py-2">
                  <p className="font-semibold text-foreground mb-1">Art. 1.q - Alterações de Preços</p>
                  <p className="text-sm text-muted-foreground">
                    O preço dos itens nos Npcs, prêmios, quests podem ser alterados a qualquer momento, sem aviso prévio. 
                    Reclamações excessivas com relação às mudanças podem acarretar banimento e até exclusão da conta.
                  </p>
                </div>

                <div className="border-l-4 border-red-500 pl-4 py-2">
                  <p className="font-semibold text-foreground mb-1">Art. 1.r - Exclusão de Contas</p>
                  <p className="text-sm text-muted-foreground">
                    Accounts com Bans ou envolvidas em irregularidades podem ser excluídas. O mesmo ocorrerá com accounts que se aproveitam de bugs e não reportam para que seja retirado o benefício advindo do bug. 
                    Caso a conta que violou as regras (foi banida ou excluída) tenha feito doação, em nenhuma hipótese os valores serão devolvidos ou reembolsados.
                  </p>
                </div>

                <div className="border-l-4 border-red-500 pl-4 py-2">
                  <p className="font-semibold text-foreground mb-1">Art. 1.s - Violação à Privacidade (Responsabilidade Civil e Criminal)</p>
                  <p className="text-sm text-muted-foreground">
                    Violações à privacidade dos players ou membros da equipe não serão permitidas. Todas as contas dos envolvidos em violação a esta regra serão banidas definitivamente e/ou excluídas no jogo. 
                    O infrator poderá responder civil e criminalmente por isso.
                  </p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <p className="font-semibold text-foreground mb-1">Art. 1.t - Reports e Investigações</p>
                  <p className="text-sm text-muted-foreground">
                    Quando o report for relacionado a bugs a situação é repassada ao programador e colocada numa lista de correção, não há prazo para ser resolvido (se puder ser resolvido). 
                    O número máximo de "Char" por conta é 10, mais que isso a conta poderá ser perdida por bug. 
                    Denúncias são investigadas na ordem de gravidade, não terão resposta da punição imposta ao infrator. 
                    Report contestando BANIMENTO somente terão resposta se o ban for revisto (retirado), se a equipe decidir que o BAN continua o report não terá resposta. 
                    Report e email não são "chats".
                  </p>
                  <p className="text-sm text-muted-foreground mt-2 font-semibold">
                    Art. 1.t.1 - Imagens para auxiliar o report deverão ser hospedadas na Internet, o report deverá conter a descrição da situação e o link da imagem.
                  </p>
                </div>

                <div className="border-l-4 border-red-500 pl-4 py-2">
                  <p className="font-semibold text-foreground mb-1">Art. 1.u - Símbolos Ofensivos (Responsabilidade Civil e Criminal)</p>
                  <p className="text-sm text-muted-foreground">
                    Não é permitido utilizar itens/objetos para criar símbolos ofensivos, que molestam e/ou que incitem a violência (Suástica, pênis, sigla de facções, etc), 
                    podendo acarretar em banimento permanente do jogo. O infrator poderá responder civil e criminalmente por isso.
                  </p>
                </div>

                <div className="border-l-4 border-red-500 pl-4 py-2">
                  <p className="font-semibold text-foreground mb-1">Art. 1.v - Mensagens Ofensivas em Locais Públicos (Responsabilidade Civil e Criminal)</p>
                  <p className="text-sm text-muted-foreground">
                    Não é permitido utilizar nas mensagens das lojas, mensagens ao usar o "correr" ou qualquer outro local onde mensagens fiquem expostas, frases ou palavras que ofendem, 
                    que molestam, que incitem a violência, links e/ou com conteúdo pornográfico, assim como qualquer outra coisa listada como proibida na sessão de nomes nas nossas regras, 
                    podendo acarretar em banimento permanente do jogo. O infrator poderá responder civil e criminalmente por isso.
                  </p>
                </div>

                <div className="border-l-4 border-red-500 pl-4 py-2">
                  <p className="font-semibold text-foreground mb-1">Art. 1.w - Simulação de Macro/Bot</p>
                  <p className="text-sm text-muted-foreground">
                    Durante uma verificação feita pelos nossos sistemas ou membros da staff, ignorar o staff ou simular ações de macro/bot é considerado, uma conduta antidesportiva, 
                    pois tem como intuito gerar dados falsos e prejudicar o desenvolvimento e imagem do jogo e/ou staff, portanto pode acarretar em banimento permanentemente do jogo.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Capítulo 2 - Canais Públicos */}
          <AccordionItem value="cap2" className="border-2 rounded-lg mb-4 px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-green-500" />
                <span className="font-bold text-lg">Capítulo 2 - Canais Públicos</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <p className="text-sm text-muted-foreground italic">
                Regras que regem as mensagens de conteúdo nos canais públicos
              </p>
              
              <div className="space-y-4">
                <div className="border-l-4 border-red-500 pl-4 py-2">
                  <p className="font-semibold text-foreground mb-1">Art. 2.a - Disregard the laws/Racism/Xenophobia/Prejudice/Nazism/Homophobia</p>
                  <p className="text-sm text-muted-foreground">
                    A exposição de materiais e sites pornográficos, mensagens que ferem as Leis vigentes da Nação (Drogas de qualquer espécie, álcool, assassinato, suicídio ou indução a ele, 
                    roubo, furto, logro, estelionato, tráfico, contrabando, apologia ao nazismo, preconceitos gerais, xenofobia, pedofilia, mensagens que incitem em discriminação racial, 
                    religiosa ou partidária seja contra os homossexuais, mulheres, negros ou qualquer grupo, raça ou credo e etc.) assim como exposição de informações pessoais são expressamente proibidos. 
                    Podendo acarretar no banimento do jogador.
                  </p>
                </div>

                <div className="border-l-4 border-red-500 pl-4 py-2">
                  <p className="font-semibold text-foreground mb-1">Art. 2.b - Unauthorized Link (Banimento Definitivo)</p>
                  <p className="text-sm text-muted-foreground">
                    Divulgação de links não autorizados são proibidos. Pode acarretar banimento definitivo.
                  </p>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4 py-2">
                  <p className="font-semibold text-foreground mb-1">Art. 2.c - Unauthorized Messages at Public Channel</p>
                  <p className="text-sm text-muted-foreground">
                    Apenas forneça informações caso tenha certeza e caso for verdadeira, jogadores que passarem informações erradas poderão ser punidos. 
                    Rumores devem ser sinalizados como tal.
                  </p>
                </div>

                <div className="border-l-4 border-orange-500 pl-4 py-2">
                  <p className="font-semibold text-foreground mb-1">Art. 2.d - SPAM/Unauthorized Messages at Public Channel</p>
                  <p className="text-sm text-muted-foreground">
                    O envio de SPAM poderá causar punição imediata de quem as enviou. São considerados SPAM mensagens sem sentido, iguais ou similares em um curto espaço de tempo.
                  </p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <p className="font-semibold text-foreground mb-1">Art. 2.e - Etiqueta em Canais Públicos</p>
                  <p className="text-sm text-muted-foreground">
                    Ao responder qualquer mensagem seja claro e educado e evite o uso de gírias. Jamais menospreze o outro só por que ele sabe menos. 
                    Caso ache que a pergunta é muito básica, que o autor da pergunta não foi educado ou que a pergunta não tem relação com o tema do grupo, simplesmente não responda, 
                    guarde seu tempo para responder mensagens onde possa ajudar com algo. Também não responda com expressões "inúteis" como: "Me dá!", "Não sei.", "Aconteceu o mesmo comigo, mas não sei o que fazer!", etc.
                  </p>
                </div>

                <div className="border-l-4 border-orange-500 pl-4 py-2">
                  <p className="font-semibold text-foreground mb-1">Art. 2.f - Anúncios não relacionados ao jogo</p>
                  <p className="text-sm text-muted-foreground">
                    É proibido utilizar os canais públicos para anúncios com intuito de comercializar algo que não seja relacionado ao jogo.
                  </p>
                </div>

                <div className="border-l-4 border-red-500 pl-4 py-2">
                  <p className="font-semibold text-foreground mb-1">Art. 2.g - Illegal Announcement (Banimento Permanente)</p>
                  <p className="text-sm text-muted-foreground">
                    É proibido utilizar os canais públicos para falar sobre e/ou fazer anúncios e propagandas de outros jogos, podendo acarretar em banimento permanente do jogo.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Capítulo 3 - Help Channel */}
          <AccordionItem value="cap3" className="border-2 rounded-lg mb-4 px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <HelpCircle className="h-5 w-5 text-purple-500" />
                <span className="font-bold text-lg">Capítulo 3 - Help Channel</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <p className="text-sm text-muted-foreground italic">
                Regras exclusivas do Help Channel
              </p>
              
              <div className="space-y-4">
                <div className="border-l-4 border-orange-500 pl-4 py-2">
                  <p className="font-semibold text-foreground mb-1">Art. 3.a - Unauthorized Messages at Public Channel</p>
                  <p className="text-sm text-muted-foreground">
                    Mensagens de compras, vendas, trocas, level up, drops e outras mensagens que não sejam duvidas são proibidas no Help Channel.
                  </p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <p className="font-semibold text-foreground mb-1">Art. 3.b - Como fazer perguntas</p>
                  <p className="text-sm text-muted-foreground">
                    Ao enviar uma pergunta, seja educado e tente incluir todos os detalhes que possam ser úteis para quem se dispuser a ajudá-lo com o problema. 
                    Lembre-se que os outros jogadores do jogo não frequentam apenas o canal para responderem suas perguntas, mas também para aprender. 
                    Além de enviar perguntas, tente sempre contribuir com algo. Os jogadores mais respeitados e mais queridos são sempre os que ajudam mais.
                  </p>
                </div>

                <div className="border-l-4 border-orange-500 pl-4 py-2">
                  <p className="font-semibold text-foreground mb-1">Art. 3.c - Unauthorized Messages at Public Channel</p>
                  <p className="text-sm text-muted-foreground">
                    Perguntas de drops, rates, quests, preços de itens de jogadores não deverão ser feitas no Help Channel, para tal, utilize o Game-Chat.
                  </p>
                </div>

                <div className="border-l-4 border-orange-500 pl-4 py-2">
                  <p className="font-semibold text-foreground mb-1">Art. 3.d - Unauthorized Messages at Public Channel</p>
                  <p className="text-sm text-muted-foreground">
                    É proibido o uso de palavras ofensivas (palavrões), além de mensagens em capslock nos chats públicos.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Capítulo 4 - Game-Chat */}
          <AccordionItem value="cap4" className="border-2 rounded-lg mb-4 px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-cyan-500" />
                <span className="font-bold text-lg">Capítulo 4 - Game-Chat</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <p className="text-sm text-muted-foreground italic">
                Regras exclusivas do Game-Chat Channel
              </p>
              
              <div className="border-l-4 border-cyan-500 pl-4 py-2">
                <p className="font-semibold text-foreground mb-1">Art. 4.a - Unauthorized Messages at Public Channel</p>
                <p className="text-sm text-muted-foreground">
                  O Game-chat é destinado apenas para dúvidas, organização de equipes para quest (desde que não envolva negociação, nesse caso deve ser feita no Trade Channel) e conversas. 
                  Mensagens de compra, venda e troca não são permitidas. Sugestões devem ser feitas no nosso fórum ou por email, e reclamações devem ser feitas por email.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Capítulo 5 - Trade Channel */}
          <AccordionItem value="cap5" className="border-2 rounded-lg mb-4 px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-5 w-5 text-yellow-500" />
                <span className="font-bold text-lg">Capítulo 5 - Trade Channel</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <p className="text-sm text-muted-foreground italic">
                Regras exclusivas do Trade Channel
              </p>
              
              <div className="border-l-4 border-yellow-500 pl-4 py-2">
                <p className="font-semibold text-foreground mb-1">Art. 5.a - Unauthorized Messages at Public Channel</p>
                <p className="text-sm text-muted-foreground">
                  O Trade Channel é destinado apenas a vendas, trocas, compras anúncios para formação de times para quests e trocas de serviço. 
                  Perguntas, dúvidas, conversas e reclamações não devem ser feitas nesse canal, para tal, utilize os canais citados anteriormente.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Capítulo 6 - Cargos e Funções */}
          <AccordionItem value="cap6" className="border-2 rounded-lg mb-4 px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <UserCheck className="h-5 w-5 text-indigo-500" />
                <span className="font-bold text-lg">Capítulo 6 - Cargos e Funções</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <p className="text-sm text-muted-foreground italic">
                Definição das funções cabíveis aos cargos
              </p>
              
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <p className="font-semibold text-foreground mb-1">Art. 6.a - Críticas e Denúncias</p>
                  <p className="text-sm text-muted-foreground">
                    Qualquer crítica ou denúncia contra os tutores ou gamemasters devem ser feitas diretamente à equipe por e-mail (contato@pokenight.com), que tomará as medidas cabíveis.
                  </p>
                </div>

                <div className="border-l-4 border-indigo-500 pl-4 py-2">
                  <p className="font-semibold text-foreground mb-1">Art. 6.b - Atitudes dos Administradores</p>
                  <p className="text-sm text-muted-foreground">
                    Sempre que se fizer necessário, os administradores irão tomar quaisquer atitudes drásticas visando manter o bom andamento do jogo.
                  </p>
                </div>

                <div className="border-l-4 border-red-500 pl-4 py-2">
                  <p className="font-semibold text-foreground mb-1">Art. 6.c - Segurança da Senha</p>
                  <p className="text-sm text-muted-foreground">
                    Nenhum tutor, gamemaster e até mesmo alguém da equipe está autorizado a pedir sua senha de acesso do jogo. 
                    Sua senha é pessoal e nem a administração irá pedi-la.
                  </p>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4 py-2">
                  <p className="font-semibold text-foreground mb-1">Art. 6.d - Responsabilidades dos Tutores/GMs</p>
                  <p className="text-sm text-muted-foreground">
                    O tutor e(ou) gamemasters pode, dentro desses princípios, punir o jogador, sendo posteriormente responsável pelo feito, 
                    sempre o relatando aos Administradores do jogo e mantendo sob sua guarda a Screenshot e chats salvos de todas as ações polêmicas tomadas por no mínimo por 30 dias, 
                    a fim de justificar seus atos perante a Administração.
                  </p>
                </div>

                <div className="border-l-4 border-red-500 pl-4 py-2">
                  <p className="font-semibold text-foreground mb-1">Art. 6.e - Proibição de Vantagens</p>
                  <p className="text-sm text-muted-foreground">
                    Nenhum tutor ou gamemaster poderá requerer para si vantagens pelo fato de ser tutor ou gamemasters. 
                    No caso de abusos denuncie tal jogador à Administração do jogo.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Capítulo 7 - Punições */}
          <AccordionItem value="cap7" className="border-2 rounded-lg mb-4 px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <Gavel className="h-5 w-5 text-red-500" />
                <span className="font-bold text-lg">Capítulo 7 - Punições</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <p className="text-sm text-muted-foreground italic">
                Regras que regem a aplicação de penalidades
              </p>
              
              <div className="space-y-4">
                <div className="border-l-4 border-yellow-500 pl-4 py-2">
                  <p className="font-semibold text-foreground mb-1">Art. 7.a - Notificações</p>
                  <p className="text-sm text-muted-foreground">
                    Qualquer jogador que viole as regras receberá uma notificação que fica gravada nas informações do personagem, 
                    podendo apenas ser averiguadas pelos Gamemasters e Administradores.
                  </p>
                </div>

                <div className="border-l-4 border-red-500 pl-4 py-2">
                  <p className="font-semibold text-foreground mb-1">Art. 7.b - Sistema de Advertências</p>
                  <p className="text-sm text-muted-foreground">
                    Já tendo uma advertência registrada e o jogador cometer nova infração, este receberá uma segunda, na terceira advertência ele será banido do jogo. 
                    Após o prazo de banimento, o sistema irá liberá-lo automaticamente. Se o jogador prosseguir cometendo infrações o mesmo será novamente notificado e banido do jogo por prazo periódico, 
                    ou seja, maior duração a cada banimento podendo em caso crítico ser banido permanentemente (deletado).
                  </p>
                </div>

                <div className="border-l-4 border-orange-500 pl-4 py-2">
                  <p className="font-semibold text-foreground mb-1">Art. 7.c - Punições Específicas</p>
                  <p className="text-sm text-muted-foreground">
                    Nos casos citados anteriormente (exemplo: Art. 1.j.) onde a punição está indicada no artigo, o jogador não receberá uma notificação e sim a punição indicada para no artigo.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Capítulo 8 - Política de Privacidade */}
          <AccordionItem value="cap8" className="border-2 rounded-lg mb-4 px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-green-500" />
                <span className="font-bold text-lg">Capítulo 8 - Política de Privacidade</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <p className="font-semibold text-foreground mb-1">Art. 8.b - Coleta de Dados</p>
                  <p className="text-sm text-muted-foreground">
                    Enquanto você fica online no jogo e navega pelo nosso site, colheremos algumas informações sobre sua navegação, como data da visita, endereço IP e tipo de navegador. 
                    Esses dados são importantes para a melhoria das funcionalidades do site e análises estatísticas. 
                    A equipe tem acesso a todas as falas e teclas digitadas. Os logs são acessados diariamente e são de propriedade do PokeNight.com.
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <p className="font-semibold text-foreground mb-1">Art. 8.c - Confidencialidade</p>
                  <p className="text-sm text-muted-foreground">
                    Estando comprometido com a privacidade das informações coletadas de seus usuários, o PokeNight.com as trata em caráter confidencial e emprega os procedimentos adequados de segurança, 
                    de forma que sejam utilizadas estritamente com o objetivo para o qual foram coletadas.
                  </p>
                </div>

                <div className="border-l-4 border-green-500 pl-4 py-2">
                  <p className="font-semibold text-foreground mb-1">Art. 8.d - Não Compartilhamento</p>
                  <p className="text-sm text-muted-foreground">
                    Em hipótese alguma o PokeNight.com irá vender, trocar, alugar ou de qualquer outra forma ceder a terceiros dados privados de seus usuários. 
                    Assim, garantindo uma conduta ética e transparente quanto à integridade das informações de seus usuários.
                  </p>
                </div>

                <div className="border-l-4 border-red-500 pl-4 py-2">
                  <p className="font-semibold text-foreground mb-1">Art. 8.e - Exceções</p>
                  <p className="text-sm text-muted-foreground">
                    Esta Política de Privacidade fica inválida e inaplicável para o usuário que desrespeitar regras mais críticas, 
                    podendo a Administração, se julgar necessário, divulgar dados privados do usuário infrator.
                  </p>
                </div>

                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <p className="font-semibold text-foreground mb-1">Art. 8.f - Modificações</p>
                  <p className="text-sm text-muted-foreground">
                    O PokeNight.com se reserva ao direito de alterar sua Política de Privacidade, caso haja necessidade, 
                    mas se compromete a divulgar neste mesmo espaço qualquer mudança, assim como inativá-lo pelo tempo necessário para proceder eventuais manutenções.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Capítulo 9 - Streamers */}
          <AccordionItem value="cap9" className="border-2 rounded-lg mb-4 px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <Radio className="h-5 w-5 text-pink-500" />
                <span className="font-bold text-lg">Capítulo 9 - Streamers e Transmissões</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="space-y-4">
                <div className="border-l-4 border-pink-500 pl-4 py-2">
                  <p className="font-semibold text-foreground mb-1">Art. 9.a - Suspensão de Parceria</p>
                  <p className="text-sm text-muted-foreground">
                    A parceria com os streamers cadastrados no nosso sistema de recompensas pode ser suspensa a qualquer momento em caso de violação das regras do jogo.
                  </p>
                </div>

                <div className="border-l-4 border-red-500 pl-4 py-2">
                  <p className="font-semibold text-foreground mb-1">Art. 9.b - Destructive Behavior</p>
                  <p className="text-sm text-muted-foreground">
                    Todas as regras do jogo são estendidas as transmissões. A violação das regras, assim como o incetivo a violação das regras, 
                    pode acarretar em banimento permanente do jogo.
                  </p>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4 py-2">
                  <p className="font-semibold text-foreground mb-1">Art. 9.c - Negação de Pedidos</p>
                  <p className="text-sm text-muted-foreground">
                    Pedidos de parceria podem ser negados a jogadores que já receberam qualquer tipo de punição no jogo e/ou nas plataformas de stream.
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Regras de Nomes */}
          <AccordionItem value="nomes" className="border-2 rounded-lg mb-4 px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <span className="font-bold text-lg">Regras de Nomes</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <Alert className="border-2 border-orange-500/50 bg-orange-500/10">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <AlertDescription className="text-sm">
                  As regras de Nomes aplicam-se aos CHARs, Guilds e Personagens (incluindo Bichos/Pokémon). 
                  Os nomes de personagens que violarem as regras serão alterados unilateralmente podendo ocorrer a exclusão do char e perda de todos os itens.
                  Após notificado, quem não alterar o nome de seu char em até 24 horas, poderá ter seu char e account excluídos do jogo.
                </AlertDescription>
              </Alert>

              <Separator className="my-4" />

              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-lg mb-3 text-red-500">Nomes Proibidos:</h4>
                  
                  <div className="space-y-4">
                    <div className="border-l-4 border-red-500 pl-4 py-2">
                      <p className="font-semibold text-foreground mb-1">Nomes Ofensivos</p>
                      <p className="text-sm text-muted-foreground">
                        Por favor certifique-se de que o seu nome não ofenda outros jogadores. Nomes que contém qualquer tipo de insulto como "Denis Bitch" ou "Carlos Viadinho" não serão tolerados.
                      </p>
                    </div>

                    <div className="border-l-4 border-red-500 pl-4 py-2">
                      <p className="font-semibold text-foreground mb-1">Nomes Racistas</p>
                      <p className="text-sm text-muted-foreground">
                        O PokeNight.com é um jogo internacional no qual pessoas de vários países podem jogar. Naturalmente, nomes racistas como "White Power", "Chicote pra preto" ou "Black Person" nunca serão tolerados.
                      </p>
                    </div>

                    <div className="border-l-4 border-red-500 pl-4 py-2">
                      <p className="font-semibold text-foreground mb-1">Nomes com Conteúdo Sexual</p>
                      <p className="text-sm text-muted-foreground">
                        O PokeNight.com é um jogo que está se popularizando entre os jovens. Com isso, buscamos deixar qualquer nome que se refira ao sexo ou orientação sexual "Hetero Man" ou "Pornstar Sex" fora do jogo. 
                        Nomes que incluem partes do corpo relacionadas ao sexo "Nipple", "Breastfeeder" ou "Penis" também não são permitidos. 
                        Similarmente, nomes de celebridades conectadas de alguma maneira com o sexo não são desejáveis. Isso inclui por exemplo artistas pornográficos, cafetões e prostitutas.
                      </p>
                    </div>

                    <div className="border-l-4 border-red-500 pl-4 py-2">
                      <p className="font-semibold text-foreground mb-1">Nomes Relacionados a Drogas</p>
                      <p className="text-sm text-muted-foreground">
                        Nomes que explicitamente se relacionam a drogas e outras substâncias ilegais "Weedsmoker" ou "Junkie" são indesejáveis e serão bloqueados. 
                        O mesmo é válido para nomes que se referem ao uso de álcool "Drunk Baby" ou "Alcohol Lover" 
                        Essa regra também proíbe o uso de nomes de traficantes famosos "Pablo Escobar" e "George Young".
                      </p>
                    </div>

                    <div className="border-l-4 border-red-500 pl-4 py-2">
                      <p className="font-semibold text-foreground mb-1">Nomes que Molestam</p>
                      <p className="text-sm text-muted-foreground">
                        Nomes criados apenas com a intenção de molestar outros jogadores "Wheelchair Macin", "Sebastian Gordo" ou para ameaçar outros na vida real "Beatyou Afterschool" e "Killyou Inrl" são ilegais, 
                        serão retirados e podem até levar a uma punição maior.
                      </p>
                    </div>

                    <div className="border-l-4 border-orange-500 pl-4 py-2">
                      <p className="font-semibold text-foreground mb-1">Outros Casos</p>
                      <p className="text-sm text-muted-foreground">
                        Existem inúmeros outros nomes que as pessoas podem achar ofensivos por uma série de razões. Por exemplo, o nome de fluidos corporais e excrementos são ofensivos "Snot Eater" e "Like Feces" 
                        assim como nomes de doenças ou deficiências "Ashtma" e "Dean the Mongolist" ou referências ao crime organizado "Mafia Godfather" e "Narcotrafico" 
                        Nomes de pessoas famosas por cometer um crime sério ou por ações desumanas também são proibidos, como assassinos em série "Charles Manson" e "Ted Bundy" ou ditadores "Hitler" e "Benito Mussolini".
                      </p>
                    </div>

                    <div className="border-l-4 border-yellow-500 pl-4 py-2">
                      <p className="font-semibold text-foreground mb-1">Nomes com Formato Inválido</p>
                      <p className="text-sm text-muted-foreground mb-2">
                        Nomes que contém partes de frases (exceto para nomes de guilds), má formatação, ou combinações sem sentido de letras.
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-2 ml-4 list-disc">
                        <li><strong>Frases:</strong> "Come to town" e "Dan Is Cool", frases incompletas "Witches kill the" e "Roubei a alma de", exclamações ou cumprimentos "Oh My God" e "Hello Man"</li>
                        <li><strong>Má Formatação:</strong> Falta de espaços "Dinhothemaster" e "Ballsofglory" ou espaços mal colocados "Din Hothema Ster" e "Ballso Fglory"</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-orange-500 pl-4 py-2">
                      <p className="font-semibold text-foreground mb-1">Nomes que fazem Anúncio</p>
                      <p className="text-sm text-muted-foreground">
                        O jogo não é uma plataforma para anunciar trocas envolvendo conteúdo que nada tem a ver com o PokeNight.com. 
                        Consequentemente, nomes que implicam tais trocas são proibidos "Potions Seller" e "Trading Tentacruel".
                      </p>
                    </div>

                    <div className="border-l-4 border-red-500 pl-4 py-2">
                      <p className="font-semibold text-foreground mb-1">Nomes que Anunciam Trocas por Dinheiro Real</p>
                      <p className="text-sm text-muted-foreground">
                        Os nomes no PokeNight.com não podem conter anúncios que implicam a venda de itens do jogo por dinheiro real "Dollar for Pokémon". 
                        Em geral qualquer nome que anuncie trocas envolvendo dinheiro real são proibidas "Vip Seller".
                      </p>
                    </div>

                    <div className="border-l-4 border-purple-500 pl-4 py-2">
                      <p className="font-semibold text-foreground mb-1">Nomes Inapropriados</p>
                      <p className="text-sm text-muted-foreground mb-2">
                        Nomes que expressam uma visão política ou religiosa, ou não se encaixam no ambiente de fantasia do PokeNight.com.
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-2 ml-4 list-disc">
                        <li><strong>Política/Religião:</strong> "Buddhist Trainer", "Jewish the catcher", "Peter Vishnu", "Juan el Musulmanes", "Pontiff Claude", "Esther the Rabbi", "Democrat", "Roy o Anarquista", "Lord Barack Obama", "Dama Dilma Rousseff"</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-red-500 pl-4 py-2">
                      <p className="font-semibold text-foreground mb-1">Nome Incitando a Violação das Regras</p>
                      <p className="text-sm text-muted-foreground mb-2">
                        Nomes que fazem apologia, incitam, anunciam ou implicam uma violação das regras do PokeNight.com.
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-2 ml-4 list-disc">
                        <li><strong>Apologia:</strong> "Lover of Ofenses" e "Wannabe Hacker" ou incitam "Spam Maker"</li>
                        <li><strong>Anúncio:</strong> "Sellmyacc", "Julie Anti Idle", "Admin of Blue", "God Pokemon", "Macrohater", "Spamshunter"</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </CardContent>
    </Card>
  )
}
