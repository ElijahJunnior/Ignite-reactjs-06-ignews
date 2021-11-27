import Head from 'next/head';
import { useEffect } from 'react';
import { RichText } from "prismic-dom";
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import { GetStaticProps, GetStaticPaths } from "next";
import { getPrismicClient } from '../../../services/prismic';
import Link from 'next/dist/client/link'

import styles from '../post.module.scss';

interface PostPreviewProps {
    post: {
        slug: string;
        title: string;
        content: string;
        updatedAt: string;
    }
}

export default function PostPreview({ post }: PostPreviewProps) {

    const [session] = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session?.activeSubscription) {
            router.push(`/posts/${post.slug}`)
        }
    }, [session])

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
                        className={`${styles.postContent} ${styles.previewContent}`}
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                    <div className={styles.continueReading}>
                        Wanna continue reading?
                        <Link href='/'>
                            <a>Subscribe now 🤗</a>
                        </Link>
                    </div>
                </article>
            </main>
        </>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}

// será usada o GetStaticProps para que a pagina seja montada de forma statica
// Como esse conteudo é gratuito é pode se lido por qualquer um não é necssario que ela sejá dinamica
export const getStaticProps: GetStaticProps = async ({ params }) => {

    // pega os parametros passados por query para a pagina
    const { slug } = params;

    // instancia o cliente do Prismic
    const prismic = getPrismicClient();

    // busca no prismic o post passado por parametro 
    const response = await prismic.getByUID('posts', String(slug), {});
    // formata o post para que ele possa ser exibido pela pagina
    const post = {
        slug,
        // tratamento do prismic para trazer o conteudo em forma de texto
        title: RichText.asText(response.data.title),
        // tratamento do prismic para trazer o conteudo em forma de html
        content: RichText.asHtml(response.data.content.splice(0, 3)),
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
            redirect: 60 * 30, // 30 minuots | tempo para recriação da pagina 
        }
    }

}