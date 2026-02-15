/*

Lógica de Programação
- Algorítmo

Fluxo Básico

[x] Descobrir quando o botão foi clicado
[x] Pegar o nome da cidade no input
[x] Enviar a cidade para o servidor
[x] Pegar a resposta e colcar na tela

Fluxo de Voz

[x] Descobrir quando o botão de voz foi clicado
[x] Começar a ouvir e pegar a transcrição
[x] Enviar a transcrição para o servidor
[x] Pegar a resposta e colcar na tela

Fluxo da IA

[x] Pegar os dados da cidade
[x] Enviar os dados para a IA
[x] Pegar a resposta e colocar na tela

*/
let chaveIA = "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"

let url = "https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}"

async function cliqueiNoBotao() {
    let cidade = document.querySelector(".input-cidade").value
    let caixa = document.querySelector(".caixa-media")
    let chave = "e27635ba5a4d5bf94972d78dff5a5a63"

    let endereco = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${chave}&units=metric&lang=pt_br`
    // Precisa avisar o Javascript que você vai até o servidor
    // Traduzir a resposta do servidor 

    let respostaServidor = await fetch(endereco)
    let dadosJson = await respostaServidor.json()

    caixa.innerHTML = `
        <h2 class="cidade">${dadosJson.name}</h2>
        <p class="temp">${Math.floor(dadosJson.main.temp)} °C</p>
        <img class="icone" src="http://openweathermap.org/img/wn/${dadosJson.weather[0].icon}.png"></img> 
        <p class="umidade">Umidade: ${dadosJson.main.humidity}%</p>
        <button class="botao-ia" onclick="roupa()">Sugestão de Roupas</button>
        <p class="resposta-ia"></p>
        `
}

function detectaVoz() {
    let reconhecimento = new window.webkitSpeechRecognition()
    reconhecimento.lang = "pt-BR"
    reconhecimento.start()

    reconhecimento.onresult = function(evento) {
        let textoTranscrito = evento.results[0][0].transcript
        document.querySelector(".input-cidade").value = textoTranscrito
        cliqueiNoBotao()
    }
}

async function roupa() {
    let temperatura = document.querySelector(".temp").textContent
    let umidade = document.querySelector(".umidade").textContent
    let cidade = document.querySelector(".cidade").textContent


    let resposta = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${chaveIA}`
        },
        body: JSON.stringify({
            model: "meta-llama/llama-4-maverick-17b-128e-instruct",
            messages: [
                {
                    "role": "user",
                    "content": `Me dê sugestão de roupa usar hoje.
                    Estou na cidade de ${cidade}, a temperatura atual é: ${temperatura}°C
                    e a umidade é: ${umidade}%
                    Me dê sugestões em 2 frases cusrtas.`
                },    
            ],
            
        })
    })

    let dados = await resposta.json()
    document.querySelector(".resposta-ia").innerHTML = dados.choices[0].message.content
    console.log(dados)

}