/* *****************************************************************************************
* Objetivo: Consumir a API WhatsApp para exibir as informações no frontend
* Data: 27/10/2025
* Autor: Marcelo Vieira
* Versão: 1.0
* *****************************************************************************************/

'use strict'

const gerarContatos = async () => {

    // requisição da api
    const response = await fetch("https://api-whatsapp-2wub.onrender.com/v1/whatsapp/user/contacts?userNumber=11987876567")
    const dados = await response.json()

    const barraLateralContatos = document.getElementById('chat-lista')

    dados.Contatos.forEach(contato => {

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

        //pensar na logica para esses dois
        // ultimaMensagem.textContent =
        // horario.textContent = 

        barraLateralContatos.appendChild(chatItem)
        chatItem.appendChild(fotoContato)
        chatItem.appendChild(chatDetalhes)
        chatDetalhes.appendChild(chatNome)
        chatDetalhes.appendChild(ultimaMensagem)
        chatItem.appendChild(chatInfo)
        chatInfo.appendChild(horario)

    })

}

gerarContatos()