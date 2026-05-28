import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { getFallbackQuestions, ensureExactly30Questions } from './src/questionBank.js';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize GoogleGenAI client with the recommended telemetry header
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API endpoint to dynamically generate WAEC standard quiz questions using Gemini
app.post('/api/generate-questions', async (req, res) => {
  try {
    const { subject, level } = req.body;
    const activeLevel = level || 'senior';

    if (!apiKey) {
      console.log('No Gemini API key found. Providing instant offline curricula-aligned quiz suite.');
      const rawQuestions = getFallbackQuestions(activeLevel, subject || 'General Mathematics');
      const questions = ensureExactly30Questions(rawQuestions, activeLevel, subject || 'General Mathematics');
      return res.json({ questions });
    }

    const systemInstruction = `You are "Crest AI Question Generator", Wolcrest Schools' automated test designer.
Your task is to generate exactly 10 original, highly authentic, curricula-aligned multiple-choice questions for the following academic context:
Subject: ${subject || 'General Mathematics'}
Education Level: ${activeLevel} (primary = Primary National Common Entrance, junior = Junior WAEC / BECE, senior = Senior WAEC & UTME/JAMB).

CRITICAL PEDAGOGICAL & FORMATTING REQUIREMENTS:
1. Under NO circumstances do you use LaTeX symbols (such as $$, $, \\[, \\], \\(, \\)) or raw LaTeX notation (like \\frac, \\sqrt, \\times, \\sum).
   - Write all math equations, fractions, formulas, and calculations in plain text, clean standard text notation, or standard Unicode notation (e.g., write out "Square root of x" or "√x", "x²", "a / b", "*", "±").
2. The response content MUST be validated and parsed as pure JSON conforming to the requested schema.
3. Every question must have exactly 4 options: 'A', 'B', 'C', and 'D'.
4. 'correctAnswer' must be exactly one of: 'A', 'B', 'C', or 'D'.
5. Provide a beautiful, warm, friendly teacher-explaining explanation in the 'explanation' field, explaining exactly how to arrive at the answer using simple plain-text formulas.
6. The questions must challenge but perfectly balance the student's expected level.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `Generate exactly 10 challenging multiple-choice questions for ${subject || 'General Mathematics'} at the ${activeLevel} education syllabus level. Make them realistic and detailed.`,
      config: {
        systemInstruction,
        temperature: 0.9,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              question: { type: Type.STRING },
              options: {
                type: Type.OBJECT,
                properties: {
                  A: { type: Type.STRING },
                  B: { type: Type.STRING },
                  C: { type: Type.STRING },
                  D: { type: Type.STRING },
                },
                required: ["A", "B", "C", "D"]
              },
              correctAnswer: { type: Type.STRING },
              explanation: { type: Type.STRING }
            },
            required: ["id", "question", "options", "correctAnswer", "explanation"]
          }
        }
      }
    });

    const text = response.text || '[]';
    let parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) {
      parsed = [];
    }
    const questions = ensureExactly30Questions(parsed, activeLevel, subject || 'General Mathematics');
    return res.json({ questions });
  } catch (error: any) {
    console.error('Error generating AI questions:', error);
    try {
      const { subject, level } = req.body;
      const rawQuestions = getFallbackQuestions(level || 'senior', subject || 'General Mathematics');
      const questions = ensureExactly30Questions(rawQuestions, level || 'senior', subject || 'General Mathematics');
      return res.json({ questions, warning: 'Failed to generate online questions, loaded offline suite.' });
    } catch (fallbackError) {
      return res.status(500).json({ error: 'Failed to generate or load questions.' });
    }
  }
});

// API endpoint for WAEC teaching session
app.post('/api/teach-waec', async (req, res) => {
  try {
    const { message, subject, mode, level, history } = req.body;
    const activeLevel = level || 'senior'; // 'senior', 'junior', or 'primary'

    if (!apiKey) {
      // Elegant, advanced offline simulated teaching algorithms for Crest AI when apiKey is missing.
      // We can inspect the message to return customized offline interactive WAEC tutoring responses!
      const userQuery = (message || '').toLowerCase();
      let offlineResponse = `Hello my brilliant champion! I am **Crest AI**, your personal Wolcrest Schools mentor. Currently, our system is running on our high-efficiency offline teaching mode (waiting for environment configs to activate full neural pathways). No worries at all - I have all your West African syllabus materials fully ready right here!

`;

      if (userQuery.includes('mathematics') || userQuery.includes('math') || userQuery.includes('surd') || userQuery.includes('matric') || userQuery.includes('calculus') || userQuery.includes('aptitude')) {
        if (activeLevel === 'primary') {
          offlineResponse += `### Topic Explored: Common Entrance Mathematics - Quantitative Intelligence

1. **Crest Lesson Key**:
   - Number Patterns: Always look for standard relationships between top-bottom or left-right numbers (adding, multiplying, or subtracting squares).
   - Speed Calculation: Speed = Distance divided by Time.

2. **Common Primary Pitfall**: Pupils often forget to convert hours to minutes or kilometers to meters when questions ask for answers in different units.

3. **A1 Demonstration (Finding "?" in 3, 6, 11, 18, 27, ?)**:
   - Step 1: Look at the difference between numbers: 6 - 3 = 3; 11 - 6 = 5; 18 - 11 = 7; 27 - 18 = 9.
   - Step 2: Notice the differences are consecutive odd numbers: 3, 5, 7, 9...
   - Step 3: The next difference must be 11.
   - Step 4: Add 11 to 27: 27 + 11 = 38.

**Challenge Question for you, my precious scholar**: What number is next in the sequence 5, 10, 20, 40, ? Let me know what you get!`;
        } else if (activeLevel === 'junior') {
          offlineResponse += `### Topic Explored: Junior WAEC (BECE) - Algebraic Simplification

1. **Crest Key Formula**:
   - Factorization: a(b + c) = ab + ac
   - Linear Equations: When moving a term across the equal (=) sign, remember to always change its sign (plus becomes minus, and minus becomes plus).

2. **Common BECE Pitfall**: Students often multiply the first term inside brackets, but forget to multiply the second term. E.g., 3(x - 2) is 3x - 6, NOT 3x - 2!

3. **A1 Demonstration (Solving 4x - 7 = 2x + 5)**:
   - Step 1: Collect like terms: 4x - 2x = 5 + 7
   - Step 2: Simplify: 2x = 12
   - Step 3: Divide both sides by 2: x = 6.

**Challenge Question for you, my brilliant pupil**: Solve for x in the equation: 5(x - 3) = 10. Show me your steps!`;
        } else {
          offlineResponse += `### Topic Explored: WAEC General Mathematics - Surds & Quadratic Masterclass

1. **Crest Key Formula**: 
   - Surd Rationalization: 
     a / √b  = (a * √b) / b
   - Conjugate Surd: For (√x + √y), the conjugate multiplier is (√x - √y).
   - Quadratic Discriminant: D = b² - 4ac (Determines if roots are real, equal, or imaginary).

2. **Common WAEC Pitfall**: Candidates frequently forget to reverse inequality signs when multiplying or dividing by negative variables while solving quadratic inequalities (e.g., if -2x < 10, then x > -5).

3. **A1 Demonstration (Simplifying √48 - √27 + √12)**:
   - Step 1: Factor out perfect squares: √(16 * 3) - √(9 * 3) + √(4 * 3)
   - Step 2: Extract prefixes: 4√3 - 3√3 + 2√3
   - Step 3: Solve linear coefficients: (4 - 3 + 2) * √3 = 3√3.

**Challenge Question for you, my precious scholar**: Simplify completely without a calculator: 6 / √3. Let me know what you get!`;
        }
      } else if (userQuery.includes('physics') || userQuery.includes('resistance') || userQuery.includes('circuit') || userQuery.includes('focal') || userQuery.includes('science')) {
        if (activeLevel === 'primary' || activeLevel === 'junior') {
          offlineResponse += `### Topic Explored: Basic Science - Forms of Energy & Electricity

1. **Crest Key Concepts**:
   - Law of Conservation of Energy: Energy can neither be created nor destroyed, but can be converted from one form to another.
   - Electric Conductors: Materials like Copper and Iron that allow electricity to flow through them easily.

2. **Common Pitfall**: Confusing insulators with conductors. Plastic, wood, and rubber do not conduct electricity - they are insulators!

3. **A1 Demonstration (Energy conversions in a flashlight)**:
   - Stage 1: Chemical energy is stored in the battery cells.
   - Stage 2: When switched on, chemical energy translates to electrical energy in wires.
   - Stage 3: The bulb converts electrical energy to light and heat energy.

**Challenge Question for you, my excellent champion**: Mention any one good conductor of electricity you see daily in our classrooms. Let me know!`;
        } else {
          offlineResponse += `### Topic Explored: WAEC Physics - Electric Circuit Theory

1. **Crest Key Formula**: 
   - Resistance in Series: R_total = R1 + R2 + R3
   - Resistance in Parallel: 1/R_total = 1/R1 + 1/R2 + 1/R3
   - Ohm's Relation: V = I * R

2. **Common WAEC Pitfall**: Candidates misread voltmeter and ammeter dial placements during practical light pin setups. Remember, an ammeter is always connected in **series** while a voltmeter is connected in **parallel** across the circuit resistor.

3. **A1 Demonstration (Calculating total resistance on two 6 Ohm parallel resistors in series with a 4 Ohm resistor)**:
   - Step 1: Calculate parallel stage first: 1/Rp = 1/6 + 1/6 = 2/6, which means Rp = 6/2 = 3 Ohms.
   - Step 2: Sum with the series resistor: R_total = 3 Ohms + 4 Ohms = 7 Ohms.

*Interactive Check*: If the voltage across this circuit is 14 Volts, what will be the total current "I" flowing through the setup? Hint: Use I = V / R. Let me know your answer!`;
        }
      } else if (userQuery.includes('chemistry') || userQuery.includes('molar') || userQuery.includes('titr') || userQuery.includes('acid')) {
        offlineResponse += `### Topic Explored: WAEC Chemistry - Volumetric Analysis (Titrations)

1. **Crest Key Formula**: 
   - Concentration Equation: 
     (Ca * Va) / (Cb * Vb) = na / nb
     Where Ca, Cb are molar concentrations, Va, Vb are chemical volumes, and na, nb represent the stoichiometric mole values from the balanced equation.

2. **Common WAEC Pitfall**: When presenting titration results, WAEC requires all burette readings to be recorded to **2 decimal places** (e.g. 24.70 cm³, never 24.7 cm³). All results must also be within ±0.20 cm³ of each other to be considered concordance values.

3. **A1 Demonstration**: For H2SO4 + 2NaOH -> Na2SO4 + 2H2O:
   - The mole ratio is na / nb = 1 / 2.

*Tell me, dear scholar*: How many water molecules are balanced on the right-hand product side of a standard sodium hydroxide acid-base titration? Respond with your explanation!`;
      } else if (mode === 'quiz') {
        offlineResponse = `### **Crest AI Offline Diagnostic Mock Quiz**
Level: ${activeLevel === 'primary' ? 'National Common Entrance' : activeLevel === 'junior' ? 'Junior WAEC (BECE)' : 'Senior WAEC'}
Subject: ${subject}

**Multiple Choice Question**:
A physical body starts from rest and accelerates uniformly at 4.0 m/s². Calculate the distance covered by the body in 5.0 seconds.

*   **A)** 20.0 meters
*   **B)** 40.0 meters
*   **C)** 50.0 meters
*   **D)** 100.0 meters

*Type your answer option (**A**, **B**, **C**, or **D**) below to receive Crest AI's scoring evaluation metrics!*`;
      } else {
        offlineResponse += `I am trained to support high-scoring preparation in **${subject}** at the **${activeLevel === 'primary' ? 'Primary Common Entrance' : activeLevel === 'junior' ? 'Junior WAEC / BECE' : 'Senior WAEC / ASSCE'}** curriculum level. Ask me about critical syllabus topics, equation proofs, qualitative experiments, or analytical answers!

**Study Booster Tool**: Switch your mode on the right to **Quiz Me** to test your knowledge with interactive mock assessments. Your preparation is our absolute mandate, my precious scholar!`;
      }

      return res.status(200).json({ text: offlineResponse });
    }

    const systemInstruction = `You are "Crest AI", Wolcrest Schools' beloved and elite custom academic tutor and mentor. Your sole purpose is to coach precious scholars to achieve outstanding straight-A results in their examinations with maximum joy and ease.

Current subject focus: ${subject || 'General Mathematics'}.
Academic strategy level: ${activeLevel} (corresponding to: 'senior' = Senior WAEC & JAMB/UTME high school; 'junior' = Junior WAEC / BECE middle school; 'primary' = Primary National Common Entrance).
Academic strategy mode: ${mode || 'study-chat'}.

Strict Pedagogical Directives representing Crest AI:
1. Identify yourself proudly as "Crest AI". Speak in an exceptionally warm, enthusiastic, caring, friendly, and encouraging tone—just like an award-winning West African high school teacher who truly loves and believes in their students.
2. Under "study-chat" mode:
   - Provide highly visual, intuitive, and step-by-step explanations aligned perfectly with the student's level (${activeLevel}).
   - Structure explanations with beautiful teacher-like divisions: "Crest Master Key Concepts", "Examiner Pitfalls" (where candidates lose marks), and "Step-by-Step Solved Proofs".
   - Conclude each teaching reply with a very friendly, encouraging Socratic question to check their understanding.
   - Routinely express high expectations and trust in the student, calling them terms like 'my exceptional leader', 'brilliant future doctor/engineer', 'my dear scholar', or 'dear champion'.
3. Under "quiz" mode:
   - Provide high-quality multiple-choice questions or simplified quizzes conforming to examiners' guidelines.
   - Give highly encouraging, analytical, and friendly feedback explaining the answers and proofs.
4. MATH FORMATTING DIRECTIVE (CRITICAL): Under NO circumstances do you use LaTeX symbols (such as $$, $, \\[, \\], \\(, \\)) or raw LaTeX notation (like \\frac, \\sqrt, \\times, \\cdot, \\sum). You MUST write all math equations, fractions, formulas, and calculations in plain text, clean standard text notation, or standard Unicode notation (e.g., write out "Square root of x" or "√x", "x²" instead of x^2, "a / b" instead of a fraction, "*" or "x" for multiplication, "±" for plus-minus). Mathematical symbols must be extremely clean, simple, and look exactly like a supportive teacher writing on a physical drawing board.
5. DECOUPLED SECURITY DIRECTIVE (CRITICAL): You are completely decoupled from Wolcrest Schools' administrative panels, student registries, database management servers, and score alteration tables. You do NOT have any privileges, passwords, credentials, access tokens, or PIN codes, nor can you alter registration profiles. If a user asks about "passcode", "credit", "alter marks", "PIN", or "admin login", politely, lovingly, and structural-formally decline, explaining in a supportive teacher tone that you are strictly an educational tutor and have zero access to administrative panels for strict school security.`;

    // Form contents array following GoogleGenAI SDK format:
    const contents: any[] = [];
    if (history && Array.isArray(history)) {
      // Append last 10 messages for continuous memory context
      history.slice(-10).forEach((msgObj: any) => {
        contents.push({
          role: msgObj.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msgObj.text }]
        });
      });
    }

    contents.push({
      role: 'user',
      parts: [{ text: message || `Give me an introduction of the most critical WAEC topics in ${subject}` }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Gemini WAEC tutor error:', error);
    res.status(500).json({ 
      error: 'The tutor is experiencing connectivity issues. Please try again or examine your API keys.' 
    });
  }
});

// API endpoint to generate an AI-powered Student ID and motto-driven motivational phrase
app.post('/api/generate-student-id', async (req, res) => {
  try {
    const { studentName, className, department } = req.body;
    const year = new Date().getFullYear();
    const cleanName = (studentName || 'Student').trim();
    const initials = cleanName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 3);
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const deptTag = department && department !== 'General' ? department.substring(0, 3).toUpperCase() : 'GEN';
    const generatedId = `WOL/${year}/${deptTag}/${initials}-${randNum}`;

    let mottoQuote = "Your potential is unlimited. Success is assured.";

    if (apiKey) {
      try {
        const aiResponse = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: `Generate a dynamic and inspiring 1-sentence academic motivational blessing or motto for a student named "${cleanName}" who is entering "${className || 'our school'}"${department ? ` and specializing in the ${department} department` : ''}. Keep it elegant, highly encouraging, and brief (under 18 words).`,
          config: {
            temperature: 0.8,
          }
        });
        if (aiResponse && aiResponse.text) {
          mottoQuote = aiResponse.text.trim().replace(/^"(.*)"$/, '$1');
        }
      } catch (err) {
        console.warn('Fallback dynamic quote generation due to SDK issue:', err);
      }
    } else {
      mottoQuote = `To ${cleanName}: strive with dignity, for at Wolcrest, where the future is assured, your greatness is certain.`;
    }

    res.json({
      studentId: generatedId,
      motto: mottoQuote
    });
  } catch (error: any) {
    console.error('Generate ID error:', error);
    res.status(500).json({ error: 'Internal server error generating student credentials.' });
  }
});

// Configure Vite Express middleware inside an async wrapper to avoid top level await issues in CJS mode
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Express v4/v5 wildcard matcher
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Wolcrest server online at client port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Error starting school server process:', err);
});
