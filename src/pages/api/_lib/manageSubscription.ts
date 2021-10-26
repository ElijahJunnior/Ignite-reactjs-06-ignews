import { query as q } from 'faunadb';
import { fauna } from "../../../services/fauna";
import { stripe } from '../../../services/stripe';

export async function saveSubscription(
    subscriptionId: string,
    customerId: string,
    createAction = false
) {
    // pega o ref do usuario que possuir o stripe_customer_id informado
    const userRef = await fauna.query(
        q.Select(
            'ref',
            q.Get(
                q.Match(
                    q.Index('user_by_stripe_customer_id'),
                    customerId
                )
            )
        )
    );
    // pega diretamente do stripe os dados da subscription que o id for informado
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    // pega os dados relevantes da subscription e associa ao id do customer no faunadb
    const subscriptionData = {
        id: subscription.id,
        userId: userRef,
        status: subscription.status,
        price_id: subscription.items.data[0].price.id
    }
    if (createAction) {
        // grava os dados da subscription na base de dados
        await fauna.query(
            q.Create(
                q.Collection('subscriptions'),
                { data: subscriptionData }
            )
        );
    } else {
        // atualiza os dados da subscription na base de dados
        await fauna.query(
            q.Replace(
                q.Select(
                    "ref",
                    q.Get(
                        q.Match(
                            q.Index('subscription_by_id'),
                            subscriptionId
                        )
                    )
                ),
                { data: subscriptionData }
            )
        );
    }
}