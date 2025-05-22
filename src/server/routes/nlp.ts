import { Router } from 'express';
import { z } from 'zod';
import NodeCache from 'node-cache';
import { analyzeText, detectLanguage, analyzeSemantics } from '../services/nlpService';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();
const cache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes

const textSchema = z.object({
  text: z.string().min(1).max(5000)
});

router.post('/analyze/text', validateRequest(textSchema), async (req, res) => {
  const { text } = req.body;
  const cacheKey = `text-analysis-${text}`;
  
  const cachedResult = cache.get(cacheKey);
  if (cachedResult) {
    return res.json(cachedResult);
  }

  const analysis = await analyzeText(text);
  cache.set(cacheKey, analysis);
  res.json(analysis);
});

router.post('/detect/language', validateRequest(textSchema), (req, res) => {
  const { text } = req.body;
  const language = detectLanguage(text);
  res.json({ language });
});

router.post('/analyze/semantic', validateRequest(textSchema), (req, res) => {
  const { text } = req.body;
  const analysis = analyzeSemantics(text);
  res.json(analysis);
});

export const nlpRouter = router;