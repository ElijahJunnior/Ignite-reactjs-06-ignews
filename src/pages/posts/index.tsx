import styles from './styles.module.scss';
import Head from 'next/head';


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