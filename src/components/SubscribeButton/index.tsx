import styles from './styles.module.scss';
import { signIn, useSession } from 'next-auth/client'
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';
import { useRouter } from 'next/router';

export function SubscribeButton() {

    // pega os dados de login do Next auth
    const [session] = useSession()
    // hookie usado para redirecionar o usuario para outra pagina
    // usado quando o redirecionamento está sendo feito de forma programatica
    // dentro de uma função, ou sejá, não causado por um click do usuario
    const router = useRouter();

    async function handleSubscribe() {

        // verifica se o usuario esta logado
        if (!session) {
            //caso não esteja logado 
            //redireciona para o fazer login com o github
            signIn('github');
            return;
        }

        // verifica e o usuario já está inscrito
        if (session.activeSubscription) {
            // caso já esteja inscrito o redireciona para o pagina de posts
            router.push('/posts');
            return;
        }

        try {
            // efetua consumo que cria o checkou do stripe 
            const response = await api.post('/subscribe');
            // pega o id do checkout
            const { sessionId } = response.data;
            // Carrega a ferramenta do Stripe
            const stripe = await getStripeJs();
            // Redireciona o usuario para a pagina de checkout
            await stripe.redirectToCheckout({ sessionId: sessionId });
        } catch (err) {
            alert(err.message);
        }
    }

    return (
        <button type='button' className={styles.subscribeButton} onClick={handleSubscribe}>
            Subscribe Now
        </button>
    );

}