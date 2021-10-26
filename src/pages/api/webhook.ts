import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from 'stream';
import Stripe from 'stripe';
import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/manageSubscription";

// função usada para transformar uma requisição stream em linear
async function buffer(readable: Readable) {
    const chunks = [];
    for await (const chunk of readable) {
        chunks.push(
            typeof chunk === 'string' ? Buffer.from(chunk) : chunk
        );
    }
    return Buffer.concat(chunks);
}

// exportar essa config desativa o bodyParser ativado por padrão no next
// é necessário desativar o bodyParser pra ler uma requisição stream
export const config = {
    api: {
        bodyParser: false
    }
}

const relevantEvents = new Set([
    'checkout.session.completed',
    'customer.subscription.updated',
    'customer.subscription.deleted',
]);

export default async (req: NextApiRequest, res: NextApiResponse) => {
    // verifica se o metodo da requisição um dos esperados
    if (req.method === 'POST') {
        // executa a função que convert a req stream em uma req tradicional
        const buf = await buffer(req);
        // chave do stripe usada para validar requisições mal intecionadas
        const secret = req.headers['stripe-signature'];
        // instacia variavel que vai conter o evento do stripe
        let event: Stripe.Event;
        // tenta montar o evento e valida se a chave secret de webhook está correta
        try {
            event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_WEBHOOKS_SECRET);
        } catch (err) {
            return res.status(400).send(`Webhook error ${err.message}`);
        }
        // descostroi o evento para pegar o seu tipo
        const { type } = event;
        // verifica se o evento do stripe esta na lista de eventos suportados
        if (relevantEvents.has(event.type)) {
            try {
                switch (type) {
                    case 'checkout.session.completed':
                        // extrai do objeto generico de evento os dados tipados da CheckoutSession
                        const checkoutSession = event.data.object as Stripe.Checkout.Session;
                        // grava o subscription no banco de dados
                        await saveSubscription(
                            checkoutSession.subscription.toString(),
                            checkoutSession.customer.toString(),
                            true
                        );
                        break;
                    case 'customer.subscription.updated':
                    case 'customer.subscription.deleted':
                        // extrai do objeto generico de evento os dados tipados da Subscription    
                        const subscription = event.data.object as Stripe.Subscription;
                        // atualiza os dados da subscription no banco de dados
                        await saveSubscription(
                            subscription.id,
                            subscription.customer.toString(),
                        );
                        break;
                    default:
                        throw new Error('Unhandled event.');
                }
            } catch (err) {
                console.log('revelantsEventsError:', err);
                return res.json({ error: 'Webhook handler failed.' });
            }
        }
        // retorno da requisição
        res.send({ received: true });
    } else {
        // retorna um erro caso o metooo não seja aceito
        res.setHeader('Allow', 'Post');
        res.status(405).end('Method not allowed');
    }
}