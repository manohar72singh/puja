// routes/kundliRouter.js
import express from 'express';
import { generateKundli } from '../controllers/kundliController.js';
import { analyzeWithGPT  } from '../controllers/gptServiceController.js';

const router = express.Router();

router.post('/generate', async (req, res) => {
  try {
    const {
      name, dateOfBirth, timeOfBirth, placeOfBirth, gender,
      latitude, longitude, timezoneOffset
    } = req.body;

    if (!name || !dateOfBirth || !timeOfBirth || !placeOfBirth || !gender)
      return res.status(400).json({ success:false, error:'All fields required.' });

    const lat = latitude   ?? 20.5937;
    const lon = longitude  ?? 78.9629;
    const tz  = timezoneOffset ?? 5.5;

    console.log(`\n📍 ${placeOfBirth} | Lat:${lat} Lon:${lon} TZ:${tz}`);

    // generateKundli is async (Swiss Ephemeris)
    const kundliData = await generateKundli(name, dateOfBirth, timeOfBirth, placeOfBirth, gender, tz, lat, lon);
    const gptResult  = await analyzeWithGPT(kundliData);

    return res.json({
      success     : true,
      kundli      : kundliData,
      analysis    : gptResult.sections,
      rawAnalysis : gptResult.rawAnalysis,
      meta        : {
        model       : gptResult.model,
        tokensUsed  : gptResult.tokensUsed,
        generatedAt : new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error('❌ Kundli Error:', err.message);
    return res.status(500).json({ success:false, error: err.message });
  }
});

export default router;