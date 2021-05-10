import { Router } from 'express';
import bodyParser from 'body-parser';
import * as swap from './swap';
import * as info from './info';

const router = Router();

router.get('/api/v1/getInfo', bodyParser.json(), info.getInfo);
router.get('/api/v1/getBalance', bodyParser.json(), info.getBalance);
router.get('/api/v1/getUncomfirmedBeldexTransactions', bodyParser.json(), swap.getUncomfirmedBeldexTransactions);
router.get('/api/v1/getSwaps', bodyParser.json(), swap.getSwaps);
router.post('/api/v1/swap', bodyParser.json(), swap.swapToken);
router.post('/api/v1/finalizeSwap', bodyParser.json(), swap.finalizeSwap);
router.post('/api/v1/transfer', bodyParser.json(), swap.transfer);

export default router;
