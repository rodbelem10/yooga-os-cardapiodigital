# Playbook de Conversão — Cardápio Digital

> Destilado de **8 benchmarks** (CardápioWeb, Delivery Direto, Saipos, Brendi, OlaClick, Anota AI, Takeat) + **Owner.com** (gold standard mundial de pedido online).

> Pesquisa multiagente, sintetizada por etapa do funil. Os itens marcados ✅ estão **implementados** nesta demo.


## 🧭 Princípios north-star

- Familiaridade radical: clone deliberadamente o padrao visual iFood/Rappi (sticky tabs + scroll-spy + card em linha + bottom-sheet de produto). Carga cognitiva zero converte mais que UI 'original'. 6 dos 8 benchmarks fazem isso de proposito.
- Fricca minima e dogma, nao feature: cada toque a menos = conversao a mais. Modo ja escolhido antes de navegar, guest checkout puro (nome+WhatsApp), endereco/dados pedidos so quando o tipo de servico exige, pagamento express no topo.
- PIX e o rei absoluto no BR: e o equivalente direto do Apple/Google Pay do Owner.com (teste real deu +6%). PIX deve ser o metodo DEFAULT, visualmente dominante, com copia-e-cola automatico + QR na mesma tela. Nunca relegar a 'copie a chave manualmente'.
- Mobile-first com meta de <3s de load (regra Anota: >3s perde cliente). Single-page long-scroll, bottom-sheets em vez de rotas, viewport travado, tudo client-side rapido. O Brasil real pede em 3G.
- Cada tela e uma alavanca de ticket (AOV), nao so de conversao: ancoragem de preco (de/por riscado), modifiers que sobem o total ao vivo, upsell contextual na sacola, faixa 'faltam R$X pro frete gratis'. Subir AOV vale tanto quanto subir conversao.
- Prova social inline reduz paralisia de decisao: badge 'Mais Pedido', secao auto-reordenada por venda real no topo, contagem/selo de popularidade. Quase nenhum benchmark BR explora isso bem = ganho facil de copiar com vantagem.
- Cart e checkout sempre visiveis e consolidados: barra de sacola sticky no rodape em TODA navegacao + checkout que junta endereco/pagamento/cupom num so painel. Esse e o padrao-ouro de delivery BR que derruba abandono.
- Transparencia antecipada mata o sticker shock: mostrar taxa de entrega e tempo no topo, e idealmente o frete ANTES da sacola montada. O erro recorrente dos 8 (Saipos/DeliveryDireto/CardapioWeb) e revelar frete so depois do endereco.
- CRO como produto (licao do Owner.com): template travado e A/B testado central, nao customizado por loja. A maior vantagem da Yooga e poder deployar um teste vencedor pra base inteira.
- First-party de ponta a ponta: manter o pedido on-site, capturar WhatsApp cedo, e fechar com confirmacao + status no WhatsApp. O canal proprio sem comissao so vence o iFood se a Yooga POSSUIR o cliente e a recompra.

## 🏠 Home / Cardápio

- Header com capa/banner + logo redondo + nome da loja + badge Aberto/Fechado + tempo estimado + taxa 'a partir de R$X' + pedido minimo, tudo visivel acima da dobra. Padrao confirmado em Brendi/Saipos/DeliveryDireto/Anota.
- Toggle Delivery/Retirada logo no topo, ANTES de navegar o cardapio (licao Owner.com: modo definido cedo encurta o checkout depois). No mock, dois chips segmentados que mudam o contexto de taxa/tempo.
- Barra de categorias horizontal STICKY no topo com scroll-spy: ao rolar, destaca a categoria ativa; ao tocar, scroll-to-anchor pra secao. Esse e o gap n.1 da Brendi (nav nao-sticky) e o padrao certo do iFood/OlaClick/Saipos.
- Secao 'Mais Pedidos' no TOPO do cardapio, antes das categorias normais (Brendi/Anota). No mock, lista curada hardcoded com badge '🔥 O favorito!' — prova social agregada + atalho de decisao que reduz tempo ate a sacola.
- Carrossel de 1-3 banners promocionais no topo (Anota/Brendi/OlaClick) pra empurrar combo do dia e dar cara de vitrine. No mock, banners estaticos clicaveis que rolam pra secao Promocoes.
- Densidade de 5-12 itens por categoria (regra de ouro Anota): menos parece pobre, mais vira paralisia. Ordenar categorias: mais vendidos -> promocoes -> principais -> acompanhamentos -> sobremesas -> bebidas.
- Card de produto em LINHA (nao grid): thumbnail + nome em negrito + descricao curta de ingredientes + preco em destaque. Esse formato e o consenso de TODOS os 8 benchmarks BR.
- Barra de busca acessivel (lupa no header) — gap critico da Brendi pra catalogos grandes; mesmo no MVP, um filtro client-side simples por nome converte em cardapios longos.
- Banner/faixa de fidelidade sticky com PROGRESSO ('faltam X pedidos pra 20% off' estilo DeliveryDireto, ou barra de pontos estilo Starbucks/Owner). No mock e estatico mas ancora recompra visualmente.
- Renderizar o cardapio com SSR/pre-render pra first paint rapido e link compartilhavel no WhatsApp — onde da pra superar TODOS os benchmarks (que sao SPA pura com shell vazio e zero SEO).

## 🍔 Detalhe do produto

- Abrir como bottom-sheet/modal sobre o cardapio (nunca trocar de rota), mantendo o scroll ao fechar. Padrao confirmado em OlaClick/Saipos/Takeat/CardapioWeb — o coracao da UX de conversao.
- Foto grande no topo + nome + descricao sensorial completa (formula Anota: ingrediente principal + modo de preparo + impacto sensorial + diferencial). Descricao rica = mais desejo = mais conversao.
- Grupos de modifiers/adicionais com regras explicitas: obrigatorio vs opcional, min/max por grupo ('Escolha 1', 'Escolha ate 3'), com validacao que BLOQUEIA adicionar se obrigatorio faltar. Padrao universal nos 8.
- Adicionais pagos com preco incremental visivel (+R$X) e stepper de quantidade por adicional — cross-sell de margem alta (bacon, borda, bebida) no ponto de maior intencao.
- CTA fixo no rodape do modal 'Adicionar • R$ XX,XX' que RECALCULA o total ao vivo conforme os adicionais. Ancoragem de preco + upsell num so botao (Takeat/Saipos/CardapioWeb). Implementavel direto com estado local.
- Campo livre de 'Observacoes' (ex: 'sem cebola', 'ponto da carne') — esperado em todos os benchmarks BR, baixo esforco no mock.
- Ancoragem de preco com strike-through 'De R$14,99 por R$14,00' em itens promocionais (Brendi/Saipos/OlaClick) e 'a partir de R$X' so quando ha variacao real de tamanho.
- Badges de restricao/dieta (Vegetariano, sem gluten, sem lactose) como filtro de relevancia (Anota/Brendi) — barato no mock, melhora percepcao de cuidado.
- Stepper de quantidade do item no modal antes de adicionar. Trivial no mock, padrao em todos.
- Selo 'Mais Pedido'/'Novidade' tambem dentro do detalhe pra reforcar a escolha (Owner badge bestseller + Anota destaque).

## 🛒 Sacola & upsell

- Barra de sacola STICKY no rodape em toda navegacao: 'Ver sacola • N itens • R$ X' aparecendo no primeiro item adicionado. Padrao-ouro citado por OlaClick/Takeat/CardapioWeb e apontado como GAP grave quando ausente (Brendi). Item mais barato e obvio de conversao.
- Upsell contextual NO MOMENTO de finalizar, dentro da sacola — nao no detalhe do produto. Secao 'Peca Tambem' com 2-3 sugestoes relevantes (bebida/sobremesa/adicional puxadas pela entrada). Owner (Smart Upsells) + Anota ('Peca Tambem') + Brendi (cross-sell 90 dias). No mock, regras estaticas 'se tem lanche, sugere bebida+sobremesa'.
- Nudge de frete gratis: 'Faltam R$ X pra frete gratis' com barra de progresso (OlaClick free-shipping threshold + CardapioWeb faixa). Alavanca de ticket comprovada, calculavel 100% no front.
- Sacola consolida tudo num painel: itens (com adicionais + stepper inline + remover), subtotal, taxa, cupom, desconto, total (DeliveryDireto antecipa dados do checkout pra cortar passos).
- Campo de cupom convidativo e persistente ('Tem um cupom?' — Saipos/OlaClick) com aplicacao AUTOMATICA quando bate a regra (pedido minimo/primeiro pedido), sem o cliente digitar codigo (CardapioWeb/DeliveryDireto). No mock, um cupom hardcoded que auto-aplica.
- Edicao inline: quantidade via stepper +/-, remover item, 'Adicionar mais itens'/'Voltar ao cardapio'. Padrao universal.
- Combos 'Compre mais e ganhe mais' / bundle com preco fechado e fartura de ingredientes (Anota/Brendi) pra elevar ticket — no mock, um card de combo na sacola.
- Avisar/bloquear quando subtotal < pedido minimo, mostrando quanto falta (CardapioWeb/Brendi enforced R$24). Validacao trivial no front.
- Strike-through do desconto aplicado visivel na sacola pra reforcar economia percebida (OlaClick 'Descontos: -R$X').
- 'Repetir ultimo pedido' em 1 clique pra recorrente (Anota/Owner) — fora do MVP de primeira compra, mas mockavel como botao.

## 💳 Checkout

- PIX no TOPO do checkout como metodo express DEFAULT e visualmente dominante — o equivalente BR do Apple Pay do Owner.com (teste real +6%). Selecionado por padrao, com tela de QR + botao 'Copiar codigo PIX' copia-e-cola na mesma tela (OlaClick/Anota/CardapioWeb).
- Guest checkout puro de 2 campos: Nome + WhatsApp, sem cadastro/senha (OlaClick/CardapioWeb/Brendi). Reconhece recorrente so pelo numero. Maxima reducao de fricca — consenso dos benchmarks.
- Fluxo enxuto em poucos passos: modo ja definido no cardapio -> sacola com upsell -> dados (nome+WhatsApp) -> endereco SO se delivery -> pagamento PIX-first -> confirmar. Evitar as 7 etapas sequenciais do Saipos (anti-padrao explicito).
- Endereco completo so quando delivery: CEP/rua/numero/bairro/complemento/referencia. No MVP mockado, formulario simples; idealmente mapa com PIN ajustavel + 'usar minha localizacao' (Anota/OlaClick) e validacao de area ANTES de finalizar — mas isso fica fora do mock sem backend.
- Mostrar taxa de entrega e tempo estimado JA na sacola/topo, nunca so depois do endereco — corrige o sticker shock que e a fraqueza recorrente de Saipos/DeliveryDireto/CardapioWeb. No mock, taxa fixa por zona hardcoded.
- Cartao de credito/debito e 'pagar na entrega' (dinheiro com 'troco para?') como fallbacks abaixo do PIX (todos os benchmarks oferecem). Carteiras (Apple/Google Pay) acima do cartao se houver gateway.
- Tela de revisao curta antes de confirmar: nome, WhatsApp, endereco, pagamento, total (OlaClick/Saipos).
- Confirmacao + envio pro WhatsApp ao finalizar (requisito do produto). CRITICO: gerar o resumo do pedido no proprio site ANTES do handoff e abrir o WhatsApp com mensagem pre-preenchida, pra nao quebrar o funil (fraqueza apontada em OlaClick/CardapioWeb/Anota).
- Agendamento opcional (Agora vs Agendar dia/hora) — captura demanda fora do pico e nao bloqueia loja fechada (Anota/OlaClick/DeliveryDireto). Mockavel como toggle + picker.
- Campo CPF na nota opcional (Saipos) — baixa prioridade, so se sobrar.

## 🛡️ Sinais de confiança

- Badge 'Mais Pedido'/'🔥 O favorito!' nos cards campeoes — prova social inline que reduz paralisia (Brendi/Owner/Anota). Quase nenhum benchmark BR explora bem = ganho facil. Hardcoded no mock.
- Secao 'Mais Pedidos' auto-reordenada por venda real no topo do cardapio (Brendi/Anota) — prova social agregada. No mock, lista curada.
- Ancoragem de preco com 'De R$X por R$Y' riscado em promocoes (Brendi/Saipos/OlaClick) — sinaliza economia e desejo.
- Status 'Aberto agora' + tempo de entrega estimado + taxa visiveis no topo (todos os benchmarks) — reduz incerteza e ansiedade de compra.
- Banner/barra de fidelidade com progresso ('faltam X pedidos pra recompensa' / barra de pontos estilo Starbucks) — DeliveryDireto/Owner. Sinal de relacionamento contínuo.
- Selos de cashback ('5% de Cashback' — Brendi) exibidos no header e na tela de pagamento (Anota) como nudge no momento de maior atencao.
- Tags de dieta/restricao (Vegetariano, sem gluten) — sinal de cuidado e relevancia (Anota/Brendi).
- Confirmacao + tracking de status do pedido por WhatsApp ('na cozinha -> saiu -> ETA' — Brendi/Anota/Saipos/OlaClick) — transparencia que derruba ansiedade e suporte; reforca confianca pos-compra.
- Cupom 'so primeiro pedido' / desconto de boas-vindas visivel como sinal de oferta honesta e gatilho de aquisicao (CardapioWeb/OlaClick/DeliveryDireto).
- Branding consistente (logo + capa de qualidade) — Brendi mostra que branding amador ('!!!!' no nome) derruba percepcao de confianca; o template deve impor um piso visual profissional independente do lojista.

## 📱 Mobile

- Single-page long-scroll com bottom-sheets em vez de rotas (Owner/OlaClick/Saipos/Takeat) — toda transicao client-side sem reload, mantendo scroll position.
- Meta de load <3s (regra Anota: >3s perde cliente). SSR/pre-render do cardapio pra first paint rapido, contra o anti-padrao de SHELL VAZIO ('Carregando o cardapio...') que afeta TODOS os 8 SPAs e gera tela branca em 3G.
- Barra de sacola sticky no rodape como componente fixo global (safe-area-inset pra iPhone) — sempre visivel acima do teclado e da home bar.
- Viewport travado (maximum-scale=1, user-scalable=no — padrao Saipos) pra dar sensacao de app nativo; PWA adicionavel a home screen.
- Botoes/alvos de toque grandes (CTA 'Adicionar' fixo no rodape do modal, steppers +/- amplos) — ergonomia de polegar.
- Header e tabs de categoria sticky que encolhem ao rolar (OlaClick 'company-logo__is-scrolled') pra economizar espaco vertical no mobile.
- Link compartilhavel com preview rico no WhatsApp (og:image da capa + nome) — onde da pra superar os SPAs que tem link preview fraco (Takeat/CardapioWeb).
- Fonte legivel e densidade media-alta foto-driven; foto forte e o maior driver de apetite no mobile (Anota: foto autentica com vapor/queijo derretendo, nao foto plastica).
- Modal de produto ocupando tela cheia (bottom-sheet full-height) com CTA fixo no rodape — padrao Saipos/OlaClick/Takeat, evita scroll perdido.
- Endereco com 'usar minha localizacao atual' + autocomplete (Anota/OlaClick) pra cortar digitacao no passo mais critico do delivery — no mock sem backend, fica como enhancement pos-MVP.

## 🎯 Backlog priorizado (impacto / esforço)


### No MVP desta demo (frontend mockado)

- ✅ **Cardapio long-scroll com tabs de categoria sticky + scroll-spy** · _alto/medio_
- ✅ **Card de produto em linha (foto + nome + descricao + preco) com badge 'Mais Pedido'** · _alto/baixo_
- ✅ **Secao 'Mais Pedidos' curada no topo do cardapio** · _alto/baixo_
- ✅ **Toggle Delivery/Retirada no topo antes de navegar** · _alto/baixo_
- ✅ **Bottom-sheet de detalhe do produto com foto grande + descricao** · _alto/medio_
- ✅ **Modifiers com required/optional + min/max + validacao bloqueante** · _alto/medio_
- ✅ **CTA 'Adicionar • R$X' com total recalculando ao vivo** · _alto/baixo_
- ✅ **Campo de observacoes livre no detalhe** · _medio/baixo_
- ✅ **Ancoragem de preco strike-through 'De/Por' em promocoes** · _medio/baixo_
- ✅ **Barra de sacola sticky no rodape ('Ver sacola • N • R$X')** · _alto/baixo_
- ✅ **Sacola consolidada: itens, stepper inline, subtotal, taxa, total** · _alto/medio_
- ✅ **Upsell contextual 'Peca Tambem' na sacola (regras estaticas)** · _alto/medio_
- ✅ **Nudge 'faltam R$X pro frete gratis' com barra de progresso** · _medio/baixo_
- ✅ **Cupom auto-aplicado ao bater regra (hardcoded)** · _medio/baixo_
- ✅ **Bloqueio/aviso de pedido minimo** · _medio/baixo_
- ✅ **Guest checkout puro: Nome + WhatsApp, sem login** · _alto/baixo_
- ✅ **PIX no topo como pagamento default com QR + copia-e-cola (mockado)** · _alto/medio_
- ✅ **Endereco completo so quando delivery** · _alto/baixo_
- ✅ **Taxa de entrega + tempo visiveis cedo (na sacola, nao so apos endereco)** · _alto/baixo_
- ✅ **Tela de revisao curta antes de confirmar** · _medio/baixo_
- ✅ **Confirmacao com resumo on-site + handoff WhatsApp pre-preenchido** · _alto/baixo_
- ✅ **Header com capa + logo + status Aberto/Fechado + tempo + taxa** · _alto/baixo_
- ✅ **Carrossel de banners promocionais no topo** · _medio/baixo_
- ✅ **Busca/filtro client-side por nome de produto** · _medio/baixo_
- ✅ **Tags de dieta/restricao nos cards** · _baixo/baixo_
- ✅ **Banner de fidelidade/cashback com progresso (estatico)** · _medio/baixo_
- ✅ **Mobile sticky/PWA: viewport travado, safe-area, bottom-sheet full-height** · _alto/baixo_

### Fora do MVP (exige backend / IA / gateway)

- ⬜ Pagamento online real via gateway (PIX/cartao processado) · _alto/alto_
- ⬜ Mapa interativo com PIN ajustavel + geolocalizacao + validacao de area · _medio/alto_
- ⬜ Cross-sell data-driven por IA (historico 90 dias de co-compra) · _alto/alto_
- ⬜ Recuperacao de carrinho abandonado via WhatsApp/IA · _medio/alto_
- ⬜ Tracking de status do pedido em tempo real (na cozinha -> ETA) · _medio/alto_
- ⬜ Programa de fidelidade/pontos funcional com acumulo real · _medio/alto_
- ⬜ Login + perfil salvo + 'repetir ultimo pedido' real · _medio/alto_
- ⬜ Pixel Meta + Google Ads embutido pra remarketing · _medio/medio_
- ⬜ A/B testing centralizado de template (CRO-as-a-service) · _alto/alto_
- ⬜ Calculo de frete por zona/distancia via backend · _alto/alto_
- ⬜ Carteiras digitais Apple/Google Pay integradas · _medio/alto_
- ⬜ Modo mesa via QR Code com numero embutido no link · _baixo/medio_

## 🔍 O que roubar de cada benchmark


**Owner.com**
- PIX no TOPO do checkout como pagamento express de 1 toque (o equivalente BR do Apple Pay deles — provável o maior ganho rápido de conversão pro mercado brasileiro)
- Guest checkout real sem cadastro, com perfil/cartão (ou chave PIX) salvo pra recorrente
- Reduzir o checkout a poucos passos: modo já definido no cardápio, sacola com upsell, pagamento express, confirmar
- Smart upsells contextuais automáticos no carrinho/checkout (puxar bebida+sobremesa a partir da entrada), idealmente por dado/IA e sem exigir configuração do restaurante
- Badge de 'mais pedido'/bestseller nos cards pra ancorar a decisão

**CardapioWeb**
- Barra de sacola persistente fixa na base ('Ver sacola • N itens • R$ X') seguindo o scroll — padrão obrigatório de conversão em delivery BR
- PIX online no próprio checkout com QR + copia-e-cola e confirmação automática, mais um desconto explícito 'pague no PIX e ganhe X%' (reduz no-show e adianta caixa)
- Checkout sem senha: só nome + WhatsApp, reconhecendo recorrente pelo número — máxima redução de fricção
- Cupom automático que se aplica sozinho ao bater a regra (pedido mínimo / primeira compra), exibido na sacola sem o cliente precisar caçar código
- Pedido mínimo + frete grátis por faixa como alavanca de ticket ('faltam R$ X para frete grátis')

**Delivery Direto**
- Banner de fidelidade fixo no topo do cardápio mostrando PROGRESSO ('faltam X pedidos pra 20% off') — gamificação leve que puxa recompra; implementar como faixa sticky com barra de progresso
- Cupom com aplicação AUTOMÁTICA por link promocional — gera um link por campanha (mídia paga/WhatsApp) que já entra com desconto aplicado, sem o cliente digitar nada (mata atrito e melhora atribuição)
- Sacola que consolida endereço + pagamento + cupom + fidelidade num único painel, antecipando os dados do checkout pra reduzir passos
- Endereço e cartão salvos pra recompra 1-clique no canal próprio — o diferencial real contra o marketplace é a recorrência
- PIX online com confirmação automática antes do preparo como método DEFAULT/destaque (taxa menor, zero no-show, é o rei no BR)

**Saipos Site Delivery**
- PIX online nativo (não manual) com repasse automático — pra um freemium de delivery, PIX é rei: integre PIX via gateway desde o MVP em vez de só 'copia e cola a chave'
- Pixel Meta + Google embutidos por padrão na loja: toda loja própria deve nascer instrumentada pra rastrear add_to_cart/purchase e alimentar remarketing — vira plataforma de aquisição, não só cardápio
- Bot de WhatsApp pra status do pedido pós-checkout: tracking no canal certo do BR, e gancho natural de recompra/retenção
- Scroll-spy de categorias sticky + bottom-sheet de detalhe com grupos de complemento (obrigatório/opcional, mín/máx, adicional com preço dinâmico e 'Adicionar R$ X' no rodapé) — esse é o padrão de UX de cardápio que converte
- Carteiras digitais (Apple/Google/Samsung Pay) pro checkout de 1 toque no cartão

**Brendi**
- Cross-sell DATA-DRIVEN: sugerir adicionais/itens na sacola com base no histórico real de co-compra da PRÓPRIA loja (janela 90 dias), não regras fixas — maior alavanca de AOV
- Recuperação de carrinho abandonado via WhatsApp: capturar telefone cedo e disparar mensagem amigável quando a sacola não fecha
- Seção 'Mais Pedidos' auto-reordenada por venda real no topo do cardápio (prova social + atalho de decisão que reduz tempo até a sacola)
- Confirmação + tracking de status do pedido por WhatsApp (na cozinha → saiu → ETA): transparência que derruba ansiedade e tickets de suporte
- Ancoragem de preço com strike-through + badges '🔥 O favorito!' e 'Novidade' direto no card

**OlaClick**
- PIX com botão 'Copiar código PIX' copia-e-cola e QR na mesma tela — fricção zero, é o jeito BR de pagar; tornar isso o pagamento default e mais proeminente
- Guest checkout de 2 campos (nome + WhatsApp) — nada de cadastro antes de comprar; pedir o resto só quando necessário pelo tipo de serviço
- Barra de carrinho sticky no rodapé com contagem de itens + total sempre visível, abrindo a sacola em bottom-sheet
- Free-shipping threshold ('Grátis a partir de R$X') com nudge no carrinho do tipo 'faltam R$Y para frete grátis' — alavanca de ticket comprovada
- Programa de pontos/fidelidade amarrado ao telefone, com banner 'Ganhe X pontos a cada R$Y' visível já no cardápio para incentivar primeiro pedido

**Takeat**
- Barra de sacola persistente no rodapé com contador + valor em TODA a navegação — implementar como componente fixo global
- Modal de produto com CTA que mostra o TOTAL dinâmico recalculando com adicionais ('Adicionar • R$ XX,XX') — ancoragem de preço + upsell num só botão
- Grupos de complementos com regras explícitas (obrigatório/'escolha até 3', mín/máx, +R$) para subir ticket sem parecer pushy
- Embutir contexto no link/QR (mesa, loja, origem) pra eliminar etapas de identificação — aplicar a qualquer fluxo on-premise/PLG
- Sacola consolidada multi-vendedor com um único checkout — ótimo padrão pra praças/food halls e marketplaces locais

**Anota AI**
- PIX com link/chave de cópia automática no 1 clique — eliminar a fricção do código Pix longo é o maior ganho de conversão barato no BR; copiar pra área de transferência automaticamente + botão 'Já paguei'
- Upsell contextual na sacola ('Peça Também') na hora exata de finalizar, com 2–3 sugestões relevantes (bebida/sobremesa/adicional) — não no detalhe do produto, mas no momento de decisão de fechar
- Mapa com PIN ajustável no checkout de endereço pra travar geolocalização exata e calcular frete por raio/bairro — corta erro de entrega e retrabalho
- 'Repetir último pedido' em 1 clique pro cliente recorrente — recompra é o jogo do delivery
- Travar liberação na cozinha só após confirmação de pagamento online (anti-pedido-fantasma) — protege o lojista e dá confiança
