import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { RichText } from 'prismic-dom';
import Prismic from '@prismicio/client';
import { getPrismicClient } from '../../services/prismic';
import styles from './styles.module.scss';

type Post = {
    slug: string,
    title: string,
    excerpt: string,
    updatedAt: string
}

type PostsProps = {
    posts: Post[]
}

export default function Posts({ posts }: PostsProps) {

    return (
        <>
            <Head>
                <title> Posts | Ignews </title>
            </Head>
            <main className={styles.container}>
                <div className={styles.posts}>
                    {
                        posts.map(post => (
                            <Link key={post.slug} href={`/posts/${post.slug}`}>
                                <a>
                                    <time>{post.updatedAt}</time>
                                    <strong>{post.title}</strong>
                                    <p>{post.excerpt}</p>
                                </a>
                            </Link>
                        ))
                    }
                </div>
            </main>
        </>
    );

}

export const getStaticProps: GetStaticProps = async () => {
    // função que monta um cliente prismic 
    const prismic = getPrismicClient()
    // busca no prismic 100 documentos do tipo personalizado posts
    const response = await prismic.query(
        [
            Prismic.predicates.at('document.type', 'posts')
        ],
        {
            fetch: ['publication.title', 'publication.content'],
            pageSize: 100
        }
    )
    // cria um novo objeto com os posts formatados para atender a necessidade da pagina 
    const posts = response.results.map(post => {
        return {
            slug: post.uid,
            // função RichText do prismic que permite capturar os dados direto em texto ou html
            title: RichText.asText(post.data.title),
            // como a pagina só precisa do primeiro paragrafo, a função varre o conteudo buscando um
            excerpt: post.data.content.find(content => content.type === 'paragraph')?.text ?? '',
            // formata a data de acordo com a necessidadde da pagina
            updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            })
        };
    });
    // retorna o conteudo para a pagina   
    return {
        props: {
            posts
        }
    }
}