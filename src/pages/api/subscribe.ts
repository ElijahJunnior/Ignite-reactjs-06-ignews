import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { stripe } from '../../services/stripe';
import { fauna } from "../../services/fauna";
import { query as q } from 'faunadb';

type User = {
    ref: {
        id: string
    },
    data: {
        stripe_customer_id?: string
    }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    // validando o metodo da requisição feita pelo usuario
    if (req.method === 'POST') {
        // acessando os cookies e buscando os dados do usuario logado
        const session = await getSession({ req });
        // buscando os dados do usuario logado na base do fauna
        const user = await fauna.query<User>(
            q.Get(
                q.Match(
                    q.Index('user_by_email'),
                    q.Casefold(session.user.email)
                )
            )
        );
        // verificando se o usuario já esta cadastrado no stripe
        if (!user.data.stripe_customer_id) {
            // criando um cliente no stripe
            const stripeCustomer = await stripe.customers.create({
                email: session.user.email,
                // metadata - verificar mais tarde
            });
            // gravando o stripeCustomerId para verificar se o usuario existe
            await fauna.query(
                q.Update(
                    q.Ref(q.Collection('users'), user.ref.id), {
                    data: {
                        stripe_customer_id: stripeCustomer.id
                    }
                })
            );
            user.data.stripe_customer_id = stripeCustomer.id;
        }
        // criando um checkout para o usuario
        const stripeCheckoutSession = await stripe.checkout.sessions.create({
            // usuario do stripe
            customer: user.data.stripe_customer_id,
            // metodos de pagamento aceitos por esse checkout
            payment_method_types: ['card'],
            // exegir que o usuario informe o endereço
            billing_address_collection: 'required',
            // qual os produtos que o usuario vai pagar com esse checkout
            line_items: [
                { price: 'price_1JbiHHFjkNKRU9CwpjLwtexS', quantity: 1 }
            ],
            // o modelo de pagamento (nesse caso uma inscrição com pagamento recorrente)
            mode: "subscription",
            // se o checkout vai ter um campo para o usuario digitar codigos de desconto
            allow_promotion_codes: true,
            // a url que o stripe vai redirecionar o usuario em caso de sucesso no pagamento
            success_url: process.env.STRIPE_SUCCESS_URL,
            // a url que o stripe vai redirecionar o usuario no caso do cancelamento da operação
            cancel_url: process.env.STRIPE_CANCEL_URL
        })
        // respondendo a req. com o codigo de sucesso e o id do checkout do stripe
        return res.status(200).json({ sessionId: stripeCheckoutSession.id });
    } else {
        // respondendo a req. com cod de erro quando o metodo não é aceito 
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method not allowed');
    }

}