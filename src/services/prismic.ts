import Prismic from '@prismicio/client';

// função para criar a retornar o cliente para acesso aos dados do prismic
// OBS: porque não criar uma unica vez o cliente e sempre retornalo no lugar sempre criar e retornar?
// RES: a documentação do prismic recomenda que o cliente sejá reciado a casda execução
export function getPrismicClient(req?: unknown) {
    const prismic = Prismic.client(
        process.env.PRISMIC_API_ADDRESS,
        {
            req,
            accessToken: process.env.PRISMIC_ACCESS_TOKEN
        }
    );
    return prismic
}