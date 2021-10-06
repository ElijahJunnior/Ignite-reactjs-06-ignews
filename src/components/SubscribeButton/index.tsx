import styles from './styles.module.scss';
import { signIn, useSession } from 'next-auth/client'
import { api } from '../../services/api';

interface SubscribeButtonProps {
    priceId: string
}

export function SubscribeButton(props: SubscribeButtonProps) {

    // pega os dados de login do Next auth
    const [session] = useSession()

    async function handleSubscribe() {
        // verifica se o usuario esta logado
        if (!session) {
            //caso não esteja logado 
            //redireciona para o fazer login com o github
            signIn('github');
            return;
        }
        try {
            const response = await api.post('/subscribe');
            const { sessionId } = response.data;
        }

    }

    return (
        <button type='button' className={styles.subscribeButton} onClick={handleSubscribe}>
            Subscribe Now
        </button>
    );

}