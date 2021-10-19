import { NextApiRequest, NextApiResponse } from "next";

export default (req: NextApiRequest, res: NextApiResponse) => {
    console.log('Evento Stripe');
    res.status(200).send('success!');
}