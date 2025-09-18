import {InferenceClient} from "@huggingface/inference"
const client = new InferenceClient(import.meta.env.VITE_HF_TOKEN);

export async function enviarParaIA(MensagemUsuario, HistoricoConversa=[]){
    if(MensagemUsuario.trim()) {
        throw new Error("Mensagem vazia.");
    }

    try {

        const mensagemContexto = [{
            role: "system",
            content: `Você é um assistente de IA especializado em psicologia. Responda de forma empática e profissional:
            
            - Forneça conselhos práticos e estratégias de enfrentamento.
            - Mantenha a confidencialidade e privacidade do usuário.
            - Use uma linguagem clara e acessível.
            - Evite jargões técnicos, a menos que o usuário os utilize.
            - Sugira técnicas terapêuticas apropriadas.
            - Seja específico em suas recomendações.
            - Quando apropriado, utilize referências teóricas

            REGRA DE FORMATAÇÃO DAS RESPOSTAS:

            - Use markdown para estruturar suas respostas
            - Organize com titulos (##) subtitulos (###) e listas(-)
            - Use **negrito** para destacar informações importantes
            - Separe o conteúdo de forma clara e objetiva
            - Inclua tecnicas especificas em listas numeradas quando apropriado
            - Termine com uma perguntade acompanhamento quando relevante


            REGRA DE PRINCIPAL:

            Você está acompanhando e auxiliando psicologos em pratica clinica
            `
        }];

        const historicoRecente = HistoricoConversa.slice(-10);
        historicoRecente.forEach(msg => {
            if(msg.type === 'user') {
                mensagemContexto.push({role: "user", context: msg.content})
            } else if(msg.type === 'bot') {
                mensagemContexto.push({role: "assistant", context: msg.content});
            }
        })

        mensagemContexto.push({role:"user", content: MensagemUsuario})

        const resposta = await client.chatCompletion({
            provider: "nebius",
            model: "openai/gpt-oss-120b",
            messages: mensagemContexto,
            max_tokens: 1500,
            temperature:0.7,
            top_p: 0.9,
            frequency_penalty: 0.1,
            presence_penalty: 0.1
        });

        const conteudo = resposta.choices?.[0]?.message?.content?.trim();

        if(!conteudo){
            throw new Error("resposta vazia da IA")
        }
        return conteudo.replace(/<think>[\s\S]*?<\think>/gi, "").trim ();
        
    } catch (error) {
        console.log(error);
    }
}