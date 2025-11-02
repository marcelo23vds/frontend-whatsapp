/* *****************************************************************************************
* Objetivo: Consumir a API WhatsApp para exibir as informações no frontend
* Data: 27/10/2025
* Autor: Marcelo Vieira
* Versão: 1.0
* *****************************************************************************************/

'use strict'

const abrirConversa = async (numeroContato, nomeContato, fotoContato) => {
    
    const conteudoPrincipal = document.querySelector('body')

    // remover a conversa anterior
    const conversaAnterior = document.querySelector('.section-conversa')
    if (conversaAnterior) {
        conversaAnterior.remove()
    }
    
    const chatUrl = `https://api-whatsapp-2wub.onrender.com/v1/whatsapp/user/chat?userNumber=11987876567&contactNumber=${numeroContato}`
    const responseChat = await fetch(chatUrl)
    const dadosChat = await responseChat.json()
    const mensagens = dadosChat.Mensagens

    const divMensagens = document.createElement('div')
    divMensagens.classList.add('mensagem-container')

    mensagens.forEach(mensagem => {

        const divMensagem = document.createElement('div')

        if (mensagem.sender === 'me') {
            divMensagem.classList.add('mensagem', 'enviada')
        } else {
            divMensagem.classList.add('mensagem', 'recebida')
        }

        //conteúdo da mensagem
        const p = document.createElement('p')
        p.textContent = mensagem.content

        //horario da mensagem
        const spanHorario = document.createElement('span')
        spanHorario.classList.add('horario')
        spanHorario.textContent = mensagem.time

        divMensagem.append(p, spanHorario)
        divMensagens.appendChild(divMensagem)

    });

    //sessao de conversa
    const sectionConversa = document.createElement('section')
    sectionConversa.classList.add('section-conversa')

    //cabecalho
    const cabecalho = document.createElement('header')
    cabecalho.classList.add('chat-cabecalho')

    const imgContato = document.createElement('img')
    imgContato.src = `./img/${fotoContato}`
    imgContato.alt = 'Foto do Contato'
    const divContatoInfo = document.createElement('div')
    divContatoInfo.classList.add('contato-info')
    const divNome = document.createElement('div')
    divNome.classList.add('contato-nome')
    divNome.textContent = nomeContato
    const divStatus = document.createElement('div')
    divStatus.classList.add('contato-status')

    divContatoInfo.append(divNome, divStatus)

    // icones cabecalho
    const divIcones = document.createElement('div')
    divIcones.classList.add('chat-icones')
    const iconeBusca = document.createElement('i')
    iconeBusca.classList.add('fa-solid', 'fa-search')
    const iconeMenu = document.createElement('i')
    iconeMenu.classList.add('fa-solid', 'fa-ellipsis-v')

    divIcones.append(iconeBusca, iconeMenu)
    cabecalho.append(imgContato, divContatoInfo, divIcones)

    //rodape
    const footer = document.createElement('footer')
    footer.classList.add('mensagem-input-barra')
    const iconeEmoji = document.createElement('i')
    iconeEmoji.classList.add('fa-regular', 'fa-face-smile')
    const iconeAnexo = document.createElement('i')
    iconeAnexo.classList.add('fa-solid', 'fa-paperclip')
    const inputMensagem = document.createElement('input')
    inputMensagem.type = 'text'
    inputMensagem.placeholder = 'Digite uma mensagem'
    const iconeMic = document.createElement('i')
    iconeMic.classList.add('fa-solid', 'fa-microphone')

    footer.append(iconeEmoji, iconeAnexo, inputMensagem, iconeMic)

    sectionConversa.append(cabecalho, divMensagens, footer)
    conteudoPrincipal.appendChild(sectionConversa)

}

const carregarContatos = (contatos) => {
    
    const barraLateralContatos = document.getElementById('chat-lista')
    
    contatos.forEach(contato => {

        const chatItem = document.createElement('div')
        chatItem.classList.add('chat-item');
        const fotoContato = document.createElement('img')
        const chatDetalhes = document.createElement('div')
        chatDetalhes.classList.add('chat-detalhes')
        const chatNome = document.createElement('h4')
        chatNome.classList.add('chat-nome')
        const ultimaMensagem = document.createElement('p')
        ultimaMensagem.classList.add('ultima-mensagem')
        const chatInfo = document.createElement('div')
        chatInfo.classList.add('chat-info')
        const horario = document.createElement('span')
        horario.classList.add('horario')

        fotoContato.src = `./img/${contato.Foto}`
        chatNome.textContent = contato.Nome
        ultimaMensagem.textContent = contato.ultimaMensagem
        horario.textContent = contato.horario

        chatItem.dataset.numero = contato.Numero
        chatItem.dataset.nome = contato.Nome
        chatItem.dataset.foto = contato.Foto

        barraLateralContatos.appendChild(chatItem)
        chatItem.appendChild(fotoContato)
        chatItem.appendChild(chatDetalhes)
        chatDetalhes.appendChild(chatNome)
        chatDetalhes.appendChild(ultimaMensagem)
        chatItem.appendChild(chatInfo)
        chatInfo.appendChild(horario)

    })

    const chatItems = document.querySelectorAll('.chat-item')
    chatItems.forEach(item => {
        item.addEventListener('click', () => {
            const numero = item.dataset.numero
            const nome = item.dataset.nome
            const foto = item.dataset.foto

            abrirConversa(numero, nome, foto)
        })
    })
}

const gerarContatos = async () => {

    const responseContatos = await fetch(`https://api-whatsapp-2wub.onrender.com/v1/whatsapp/user/contacts?userNumber=11987876567`)
    const dadosContatos = await responseContatos.json()

    // busca em paralelo das últimas mensagens para cada contato
    // .map() percorre todos os contatos e para cada um executa uma função assincrona que busca suas mensagens
    // cada iteração retorna um novo objeto com os dados do contato, a última mensagem e o horário
    // O Promise.all aguarda todas as requisições terminarem e devolve um array com todos os contatos atualizados
    const contatosComMensagens = await Promise.all(dadosContatos.Contatos.map(async (contato) => {
        
        const chatUrl = `https://api-whatsapp-2wub.onrender.com/v1/whatsapp/user/chat?userNumber=11987876567&contactNumber=${contato.Numero}`
        const responseChat = await fetch(chatUrl)
        const dadosChat = await responseChat.json()

        const mensagens = dadosChat.Mensagens
        let ultimaMensagem = 'Nenhuma mensagem recente'
        let horario = ''

        if (mensagens && mensagens.length > 0) {
            const ultima = mensagens.at(-1)
            ultimaMensagem = ultima.content
            horario = ultima.time
        }

        return {
            //os 3 pontos servem para copiar os dados anteriores do array (copia as propriedades do objeto original para o novo)
            ...contato,
            ultimaMensagem,
            horario
        }
    }))
    
    carregarContatos(contatosComMensagens)
}

gerarContatos()
