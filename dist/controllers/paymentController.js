"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv = __importStar(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv.config({ path: path_1.default.resolve(__dirname, '../../.env') });
class PaymentController {
    constructor() {
        this.add = this.add.bind(this);
    }
    add(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.body) {
                    res.status(400).json({ message: 'Request body is missing' });
                    return;
                }
                const { cardholderName, cardNumber, expirationMonth, expirationYear, cvv, amount, currency, description } = req.body;
                const token = process.env.keyfakepayment;
                const response = yield axios_1.default.post('https://fakepayment.onrender.com/payments', {
                    "full-name": cardholderName,
                    "card-number": cardNumber,
                    "expiration-month": expirationMonth,
                    "expiration-year": expirationYear,
                    "cvv": cvv,
                    "amount": amount,
                    "currency": currency,
                    "description": description,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                res.json({ message: 'Payment completed', apiResponse: response.data });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Error processing payment' });
            }
        });
    }
    processPayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Payment data received:', req.body);
            const simulatedError = Math.random() < 0.2;
            if (simulatedError) {
                res.redirect('/payment/error');
            }
            else {
                res.redirect('/pago/confirmacion');
            }
        });
    }
}
exports.PaymentController = PaymentController;
//# sourceMappingURL=paymentController.js.map