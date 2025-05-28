import { Request, Response } from 'express';
import axios from 'axios';
import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export class PaymentController {

  constructor() {
    this.add = this.add.bind(this);
  }

  public async add(req: Request, res: Response): Promise<void> {
    try {
      if (!req.body) {
        res.status(400).json({ message: 'Request body is missing' });
        return;
      }
      const {
        cardholderName,
        cardNumber,
        expirationMonth,
        expirationYear,
        cvv,
        amount,
        currency,
        description
      } = req.body;

      const token = process.env.keyfakepayment;


      const response = await axios.post(
        'https://fakepayment.onrender.com/payments',
        {
          "full-name": cardholderName,
          "card-number": cardNumber,
          "expiration-month": expirationMonth,
          "expiration-year": expirationYear,
          "cvv": cvv,
                "amount":amount,
                        "currency":currency,
                        "description":description,
                      
        },
        {
          headers: {
            Authorization: `Bearer ${token}`}})


      res.json({ message: 'Payment completed', apiResponse: response.data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error processing payment' });
    }
  }
    public async processPayment(req: Request, res: Response): Promise<void> {
    console.log('Payment data received:', req.body);
    const simulatedError = Math.random() < 0.2;

    if (simulatedError) {
      res.redirect('/payment/error');
    } else {
      res.redirect('/pago/confirmacion');
    }
  }
    
  
 

}