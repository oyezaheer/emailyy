const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const requireLogin = require('../middlewares/requireLogin');




module.exports = app => {
  app.post('/api/stripe', requireLogin, async (req, res) => {
    const product = await stripe.products.create({
      name: "harddd"
      // images: productImages
      });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          unit_amount: 500,
          currency: 'usd',
          // description: '$5 for 5 credits',
          product: product.id
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });

    // const charge = await stripe.charges.create({
    //   amount: 500,
    //   currency: 'usd',
    //   description: '$5 for 5 credits',
    //   source: req.body.id
    // });

    req.user.credits += 5;
    const user = await req.user.save();
    // console.log(charge);
    console.log("user",user)

    return res.send(user);
  });
};
