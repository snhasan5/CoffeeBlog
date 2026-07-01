const stripe = require("stripe")(process.env.STRIPE_SECRET);
const YOUR_DOMAIN = "http://localhost:3000";

module.exports.getCheckoutPage= (req,res,next)=>{
    res.render('payment/checkout', {
        activePage: 'checkout',
  pageTitle: 'Checkout',
    });
}

module.exports.createPaymentSession = async (req, res, next) => {
  try {
    const donation = Number(req.body.donation);

    if (!donation || donation < 50) {
      return res.status(400).render('payment/cancel', {
        activePage: 'checkout',
        pageTitle: 'Payment Canceled',
        message: 'Please enter a donation of at least ₹50.',
      });
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: 'CoffeeBlog Donation',
            },
            unit_amount: donation * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/success`,
      cancel_url: `${YOUR_DOMAIN}/cancel`,
    });

    res.redirect(303, session.url);
  } catch (err) {
    console.log(err);
    res.status(400).render('payment/cancel', {
      activePage: 'checkout',
      pageTitle: 'Payment Canceled',
      message: 'Stripe could not start checkout for this donation. Please check the amount and try again.',
    });
  }
}

module.exports.getSuccessPage = (req,res,next)=>{
    res.render('payment/success', {
        activePage: 'checkout',
        pageTitle: 'Payment Successful',
    });
}

module.exports.getCancelPage = (req,res,next)=>{
    res.render('payment/cancel', {
        activePage: 'checkout',
        pageTitle: 'Payment Canceled',
    });
}