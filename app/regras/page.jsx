'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import TermosCondicoes from '@/components/regras/termos-condicoes'
import { 
  AlertTriangle, 
  Shield, 
  Scale, 
  Users, 
  MessageSquare, 
  HelpCircle, 
  ShoppingCart, 
  UserCheck,
  Gavel,
  Lock,
  Radio,
  FileText
} from 'lucide-react'

export default function RegrasPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-10 text-center">
        {/* Pokémon acima do título */}
        <div className="flex justify-center mb-4">
          <img 
            src="/pokemon/pikachu.png" 
            alt="Pikachu" 
            className="w-20 h-20 object-contain opacity-90 hover:opacity-100 transition-opacity animate-bounce"
          />
        </div>

        <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
          <span>Regras do </span> <span className='text-primary'>PokeNight</span>
        </h2>
        <div
          className="mx-auto mt-2 h-1 w-24 rounded bg-[var(--color-pokenight-yellow)]"
          aria-hidden="true"
        />
        <p className="mt-5 text-muted-foreground text-lg">
          Leia atentamente todas as regras antes de jogar. O desconhecimento das regras não isenta o jogador de punições.
        </p>
      </div>

      <Alert className="mb-8 border-2 border-yellow-500/50 bg-yellow-500/10">
        <AlertTriangle className="h-5 w-5 text-yellow-500" />
        <AlertDescription className="text-sm">
          <strong>Importante:</strong> As regras podem ser alteradas sem aviso prévio. Verifique-as regularmente. 
          Ninguém é obrigado a jogar o PokeNight. Se não concordar com estas regras, não jogue e não faça doações.
        </AlertDescription>
      </Alert>

      {/* Introdução */}
      <Card className="mb-6 border-2">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Introdução</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>Bem vindos ao jogo PokeNight.com!</p>
          
          <p>
            É importante ressaltar que o PokeNight.com é fruto de uma sociedade independente, com utilização gratuita e sem fins lucrativos. 
            Nosso intuito é a divulgação do anime e mangá para todas as pessoas respeitando os direitos autorais e marcas do autor.
          </p>
          
          <p>
            Todas as imagens, logotipos, nomes referentes ao anime citados pertencem aos detentores da marca.
          </p>
          
          <p>
            Ninguém é obrigado a jogar o PokeNight.com. Se não concordar com estas regras, não jogue e não faça doações.
          </p>
          
          <p className="font-semibold text-foreground">
            As regras existem para melhor organização do jogo e para que haja respeito mútuo entre os players.
          </p>
        </CardContent>
      </Card>

      {/* Considerações Gerais */}
      <Card className="mb-6 border-2">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-orange-500" />
            <CardTitle className="text-2xl">Considerações e Regras Gerais</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            A equipe PokeNight.com, gamemasters, tutores e colaboradores tentam de toda forma organizar o jogo, 
            mas é impossível controlar todas as mensagens, problemas, etc.
          </p>
          
          <ul className="space-y-3 list-none">
            <li className="flex gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                Não garantimos a funcionalidade do sistema e nem mesmo garantimos que não haverá nenhuma perda por parte do jogador. 
                Sempre que perceber instabilidade no sistema, guarde seus itens em local seguro e relogue o seu personagem para que não haja perdas irrecuperáveis.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                As regras do jogo poderão ser alteradas sem qualquer aviso prévio, você deverá verificá-las sempre que possível.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                Sempre utilize senha "forte" (com letras, pontos e números aleatórios e intercalados), também utilize um bom anti-vírus. 
                A equipe faz o possível para evitar e suspende as contas suspeitas, mas casos de "Hacks" não são garantidos pela equipe em nenhuma hipótese.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                Jamais clique em links externos. Cuidado com sites "Fake". Todas as novidades somente serão postadas no Site e redes sociais oficiais.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                O PokeNight.com, por questões de segurança, registra o IP dos jogadores, logs de comandos e falas (todas as teclas digitadas são gravadas).
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                As accounts e logs são de propriedade do PokeNight.com.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                Dependendo da gravidade da violação das regras ou quando tal fato for considerado crime pelo Código Penal a conta poderá ser suspensa definitivamente.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                Para obter suporte via e-mail "contato@pokenight.com", sempre envie o nome do CHAR.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                Na hipótese de queda do sistema ou lags excessivos por ataques à rede/servidores, infelizmente não é possível a recuperação de CATCH e/ou Itens perdidos 
                pois o sistema também perde esses logs, por esse motivo você deve sair do jogo e entrar novamente sempre que sentir instabilidade no servidor, 
                essa ação salva seu personagem e itens, diminuindo o risco de perdas.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                A partir da segunda punição grave (ofensa ou bug abuse) a conta poderá ser imediatamente excluída.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                Quando identificado o uso de bot, macro ou programas similares a conta poderá ser imediatamente excluída.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                O usuário que emprestar conta ou casa para guarda de itens irregulares (objeto de furto, de comércio irregular ou fora do jogo) perderá a casa e a conta será suspensa (banida). 
                Caso alguém invitado na casa cometa irregularidades a casa será retirada do proprietário sem aviso e o dono da casa poderá ser banido.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary mt-1">•</span>
              <span>
                Não oferecemos serviço de recuperação de contas, é obrigatório a verificação semanal do email de cadastro para consultar se houve pedido de troca de email ou autorização de computador. 
                Qualquer problema deve ser resolvido diretamente com o provedor de email (Google, Hotmail, Apple, Yahoo), sempre utilize dupla autenticação de email.
              </span>
            </li>
          </ul>
          
          <p className="font-semibold text-foreground">
            Caso encontre algum problema ou tenha alguma dúvida, procure algum tutor, gamemaster ou à administração do jogo enviando e-mail para contato@pokenight.com.
          </p>
        </CardContent>
      </Card>

      {/* Termos e Condições - Componente Separado */}
      <TermosCondicoes />

      {/* Não é Considerado Ilegal */}
      <Card className="mb-6 border-2 border-green-500/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-green-500" />
            <CardTitle className="text-2xl text-green-500">NÃO É CONSIDERADO ILEGAL</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-muted-foreground">
          <ul className="space-y-3 list-none">
            <li className="flex gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>
                <strong>KS (Killing Steal):</strong> Atacar e derrotar o Pokémon que outro jogador está atacando. 
                Lembrando que o jogador não é dono do Pokémon, todos tem o direito de vir a atacar os Pokémon.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>
                <strong>Invasão de Respawn:</strong> Caçar no mesmo lugar onde outro jogador está caçando. 
                Lembrando que os lugares de caça, respawns, ilhas não são de propriedade dos jogadores, qualquer jogador tem o direito de caçar em qualquer lugar.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>
                <strong>Lurer:</strong> Atrair o Pokémon selvagem para perto de onde outro jogador está para tentar mata-lo, ou atrapalhar não é considerado ilegal, 
                afinal o jogador possui a chance de escapar como também de derrotar o Pokémon.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>
                <strong>Empurrar:</strong> Sem ser para fazer o jogador Bloquear.
              </span>
            </li>
          </ul>
          
          <Separator className="my-4" />
          
          <div className="space-y-2">
            <p className="font-semibold text-foreground">A equipe jamais se responsabilizará por:</p>
            <ul className="space-y-2 list-none ml-4">
              <li className="flex gap-2">
                <span className="text-yellow-500 mt-1">⚠</span>
                <span>Relações privadas entre os jogadores, empréstimo, troca de itens, etc.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-yellow-500 mt-1">⚠</span>
                <span>Itens deixados em houses.</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
