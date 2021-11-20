import { query as q, query } from 'faunadb';
import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { fauna } from '../../../services/fauna';

export default NextAuth({
    providers: [
        Providers.GitHub({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            scope: 'read:user'
        }),
    ],
    callbacks: {
        // esse callback está sendo usado para adicionar mais informações a contexto session
        // assim outras informações de usuario podem ser propagados junto com a session
        async session(session) {
            try {
                // buscar na base de dados uma inscrição que pertença ao usuario logado e que esteja ativa
                const userActiveSubscription = await fauna.query(
                    q.Get(
                        q.Intersection([
                            q.Match(
                                q.Index('subscription_by_user_ref'),
                                // filtra u
                                q.Select(
                                    'ref',
                                    q.Get(
                                        q.Match(
                                            q.Index('user_by_email'),
                                            q.Casefold(session.user.email)
                                        )
                                    )
                                )
                            ),
                            q.Match(
                                q.Index('subscription_by_status'),
                                'active'
                            )

                        ])
                    )
                )
                // retorna um novo objeto contendo todas as propriedade da Session e os dados do inscrição
                return {
                    ...session,
                    activeSubscription: userActiveSubscription
                };
            } catch (err) {
                // caso o fauna não escontro nenhum registro ele irá disparar um erro
                // necessa caso a função irá retornar as dados da Session e null no lugar a inscrição
                return {
                    ...session,
                    activeSubscription: null
                }
            }
        },
        async signIn(user, account, profile) {
            const { email } = user;
            try {
                // verifica se o usuario existe na base e o cria caso não exista
                await fauna.query(
                    q.If(
                        q.Not(
                            q.Exists(
                                q.Match(
                                    q.Index('user_by_email'),
                                    q.Casefold(email)
                                )
                            )
                        ),
                        q.Create(
                            q.Collection('users'),
                            { data: { email } }
                        ),
                        q.Get(
                            q.Match(
                                q.Index('user_by_email'),
                                q.Casefold(email)
                            )
                        )
                    )
                );
                return true;
            } catch {
                return false;
            }
        }
    }

})







