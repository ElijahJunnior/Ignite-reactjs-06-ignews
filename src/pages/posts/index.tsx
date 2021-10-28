import styles from './styles.module.scss';
import Head from 'next/head';
import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import { getPrismicClient } from '../../services/prismic';


export default function Posts() {

    return (
        <>
            <Head>
                <title> Posts | Ignews </title>
            </Head>
            <main className={styles.container}>
                <div className={styles.posts}>
                    <a href='#'>
                        <time>12 de março de 2021</time>
                        <strong> Creating a Monorepo with Learna e Yarn Workspace</strong>
                        <p> On this guide, you will larn how to creating a Monorepo with Learna e Yarn Workspace </p>
                    </a>
                    <a href='#'>
                        <time>12 de março de 2021</time>
                        <strong> Creating a Monorepo with Learna e Yarn Workspace</strong>
                        <p> On this guide, you will larn how to creating a Monorepo with Learna e Yarn Workspace </p>
                    </a>
                    <a href='#'>
                        <time>12 de março de 2021</time>
                        <strong> Creating a Monorepo with Learna e Yarn Workspace</strong>
                        <p> On this guide, you will larn how to creating a Monorepo with Learna e Yarn Workspace </p>
                    </a>
                </div>
            </main>
        </>
    );

}

export const getStaticProps: GetStaticProps = async () => {
    const prismic = getPrismicClient()
    const response = await prismic.query(
        [
            Prismic.predicates.at('document.type', 'posts')
        ],
        {
            fetch: ['publication.title', 'publication.content'],
            pageSize: 100
        }
    )
    // console.log("resultodo_carregamento_prismic::::", JSON.stringify(response, null, 2));
    return {
        props: {}
    }
}