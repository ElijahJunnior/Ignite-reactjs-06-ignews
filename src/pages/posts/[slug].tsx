import Head from 'next/head';
import { RichText } from "prismic-dom";
import { GetServerSideProps } from "next";
import { getSession } from 'next-auth/client';
import { getPrismicClient } from '../../services/prismic';

import styles from './post.module.scss';

interface PostProps {
    post: {
        slug: string;
        title: string;
        content: string;
        updatedAt: string;
    }
}

export default function Post({ post }: PostProps) {
    return (
        <>
            <Head>
                <title>{post.title} | Ignews </title>
            </Head>
            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{post.title}</h1>
                    <time>{post.updatedAt}</time>
                    <div
                        className={styles.postContent}
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                    {/* > {post.content} </div> */}
                </article>
            </main>
        </>
    )
}

// será usada o ServerSidaGeneration para que a pagina seja montada de forma dinamica 
// isso é necessário para permitir que apenas os usuarios logados e inscritos possam acessar os posts
export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {

    // pega os parametros passados por query para a pagina
    const { slug } = params;

    // pega a contexto session criado pelo nextAuth
    const session = await getSession({ req });

    // verfica se o usuario está logado e se está co a inscrição ativa
    if (!session || !session.activeSubscription) {
        // caso o usuario não atenda aos requisitos o redireciona para a pagina home
        return {
            redirect: {
                destination: '/',
                // informa aos buscadores que o redirecionamento está ocorrendo por causa
                // da regra de negocios é não porque a pagina deixou de existir
                permanent: false
            }
        }
    }

    // instancia o cliente do Prismic
    const prismic = getPrismicClient(req);
    // busca no prismic o post passado por parametro 
    const response = await prismic.getByUID('posts', String(slug), {});
    // formata o post para que ele possa ser exibido pela pagina
    const post = {
        slug,
        // tratamento do prismic para trazer o conteudo em forma de texto
        title: RichText.asText(response.data.title),
        // tratamento do prismic para trazer o conteudo em forma de html
        content: RichText.asHtml(response.data.content),
        // formatação de data
        updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        })
    }

    // retorna o conteudo já tratado para ser exibido
    return {
        props: {
            post,
        }
    }

}