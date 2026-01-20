import express from 'express';
import cors from 'cors';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use(cors());
app.use(express.json());

// Career Coach Chat
app.post('/api/ai/coach/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    const messages = [
      {
        role: 'system',
        content: `You are an expert career coach and advisor. Your role is to:
- Provide personalized career guidance and advice
- Help with job search strategies and interview preparation
- Suggest skill development paths and learning resources
- Offer resume and CV improvement tips
- Give motivational support and career planning advice

Be friendly, professional, and encouraging. Keep responses concise but helpful (2-3 paragraphs max).`
      },
      ...conversationHistory,
      {
        role: 'user',
        content: message
      }
    ];

    const completion = await groq.chat.completions.create({
      messages: messages,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.';

    res.json({
      response: response,
      suggestions: [
        'Tell me about career paths in tech',
        'How can I improve my resume?',
        'What skills should I learn?',
        'Tips for job interviews'
      ]
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to get response from AI',
      message: error.message 
    });
  }
});

// CV Analysis (Improved version)
app.post('/api/ai/cv/analyze', async (req, res) => {
  try {
    const { cvText } = req.body;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an expert CV/Resume analyzer with 15+ years of recruitment experience. 

CRITICAL INSTRUCTIONS:
1. READ THE ENTIRE CV CAREFULLY before analyzing
2. Base your analysis ONLY on what is actually written in the CV
3. DO NOT recommend skills that are already listed in the CV
4. DO NOT say "lack of metrics" if the CV contains specific numbers, percentages, or achievements
5. Be specific and cite examples from the CV

ANALYSIS FORMAT:
1. Overall Score (0-100): Provide a realistic score based on:
   - Clarity and structure (20 points)
   - Relevant experience (30 points)
   - Technical skills (20 points)
   - Achievements and metrics (20 points)
   - Education and certifications (10 points)

2. Key Strengths (3-5 points): List actual strengths found in the CV with specific examples

3. Areas for Improvement (3-5 points): Suggest realistic improvements that are NOT already present

4. Recommended Skills to Add (3-5 skills): Suggest skills that are:
   - NOT already in the CV
   - Relevant to the candidate's career level
   - Valuable for their field

Be honest, specific, and helpful. Cite actual content from the CV in your analysis.`
        },
        {
          role: 'user',
          content: `Please analyze this CV thoroughly and provide detailed feedback:\n\n${cvText}`
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 1500,
    });

    const analysis = completion.choices[0]?.message?.content;
    
    // Extract score from AI response
    const scoreMatch = analysis.match(/(?:score|rating)[\s:]*(\d+)(?:\/100)?/i);
    const aiScore = scoreMatch ? parseInt(scoreMatch[1]) : 85;

    // Parse AI response to extract structured data
    const strengthsMatch = analysis.match(/(?:strengths?|strong points?)[\s:]*\n([\s\S]*?)(?=\n\n|\n(?:areas|improvements?|weaknesses|recommended))/i);
    const improvementsMatch = analysis.match(/(?:areas for improvement|improvements?|weaknesses)[\s:]*\n([\s\S]*?)(?=\n\n|\n(?:recommended|skills))/i);
    const skillsMatch = analysis.match(/(?:recommended skills?|skills to add)[\s:]*\n([\s\S]*?)(?=\n\n|$)/i);

    const parseList = (text) => {
      if (!text) return [];
      return text.split('\n')
        .filter(line => line.trim())
        .map(line => line.replace(/^[-*•\d.)\s]+/, '').trim())
        .filter(line => line.length > 0)
        .slice(0, 5);
    };

    const strengths = strengthsMatch ? parseList(strengthsMatch[1]) : [
      'Professional experience documented',
      'Technical skills present',
      'Education background included'
    ];

    const improvements = improvementsMatch ? parseList(improvementsMatch[1]) : [
      'Consider adding more specific examples',
      'Highlight measurable outcomes',
      'Expand on key achievements'
    ];

    const recommendedSkills = skillsMatch ? parseList(skillsMatch[1]) : [
      'Industry-specific certifications',
      'Emerging technologies',
      'Soft skills documentation'
    ];

    res.json({
      score: aiScore,
      analysis: analysis,
      strengths: strengths,
      improvements: improvements,
      recommendedSkills: recommendedSkills
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze CV',
      message: error.message 
    });
  }
});

// CV Screening for Recruiters (Match CV with Job)
app.post('/api/ai/cv/screen', async (req, res) => {
  try {
    const { cvText, jobDescription, jobRequirements, jobTitle } = req.body;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are an expert recruiter and CV screening specialist. Analyze CVs objectively and provide detailed feedback.

CRITICAL: You MUST respond with ONLY a valid JSON object, no other text before or after.

JSON FORMAT (copy this structure exactly):
{
  "matchScore": 85,
  "skillScore": 90,
  "experienceScore": 85,
  "educationScore": 80,
  "certificationScore": 75,
  "strengths": ["Specific strength 1", "Specific strength 2", "Specific strength 3"],
  "weaknesses": ["Specific weakness 1", "Specific weakness 2"],
  "keySkills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4", "Skill 5"],
  "recommendation": "Clear recommendation text"
}

SCORING CRITERIA (0-100 for each):
1. matchScore: Overall fit for the position
2. skillScore: Technical skills match with job requirements
3. experienceScore: Years and relevance of experience
4. educationScore: Educational background fit
5. certificationScore: Professional certifications and training

ANALYSIS RULES:
1. Be specific - cite actual skills/experience from CV
2. Compare CV skills with job requirements carefully
3. Consider experience level and relevance
4. Provide 3-5 strengths and 2-4 weaknesses
5. List 5-7 key skills found in CV that match job
6. Give clear hiring recommendation

SCORING GUIDELINES:
- 90-100: Exceptional match, exceeds requirements
- 80-89: Strong match, meets all requirements
- 70-79: Good match, meets most requirements
- 60-69: Moderate match, some gaps
- Below 60: Significant gaps

IMPORTANT: Return ONLY the JSON object, nothing else!`
        },
        {
          role: 'user',
          content: `Analyze this CV for the job position.

JOB TITLE: ${jobTitle}

JOB DESCRIPTION:
${jobDescription}

JOB REQUIREMENTS:
${jobRequirements}

CANDIDATE CV:
${cvText}

Return ONLY a JSON object with matchScore, skillScore, experienceScore, educationScore, certificationScore, strengths, weaknesses, keySkills, and recommendation.`
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      max_tokens: 1500,
    });

    let analysis = completion.choices[0]?.message?.content;
    console.log('Raw AI response:', analysis);
    
    // Clean up response - remove markdown code blocks if present
    analysis = analysis.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Try to parse as JSON
    let result;
    try {
      result = JSON.parse(analysis);
      
      // Validate and ensure all fields exist with defaults
      result.matchScore = result.matchScore || 70;
      result.skillScore = result.skillScore || result.matchScore || 70;
      result.experienceScore = result.experienceScore || result.matchScore || 70;
      result.educationScore = result.educationScore || result.matchScore - 5 || 65;
      result.certificationScore = result.certificationScore || result.matchScore - 10 || 60;
      result.strengths = Array.isArray(result.strengths) ? result.strengths : ['Relevant experience'];
      result.weaknesses = Array.isArray(result.weaknesses) ? result.weaknesses : ['Some areas need improvement'];
      result.keySkills = Array.isArray(result.keySkills) ? result.keySkills : ['Technical skills'];
      result.recommendation = result.recommendation || 'Consider for interview';
      
    } catch (e) {
      console.error('JSON parse error:', e);
      console.error('Failed to parse:', analysis);
      
      // Manual parsing as fallback
      const scoreMatch = analysis.match(/(?:matchScore|score)["']?\s*:\s*(\d+)/i);
      const skillMatch = analysis.match(/(?:skillScore)["']?\s*:\s*(\d+)/i);
      const expMatch = analysis.match(/(?:experienceScore)["']?\s*:\s*(\d+)/i);
      const eduMatch = analysis.match(/(?:educationScore)["']?\s*:\s*(\d+)/i);
      const certMatch = analysis.match(/(?:certificationScore)["']?\s*:\s*(\d+)/i);
      
      const matchScore = scoreMatch ? parseInt(scoreMatch[1]) : 70;

      const strengthsMatch = analysis.match(/(?:strengths?)["']?\s*:\s*\[(.*?)\]/is);
      const weaknessesMatch = analysis.match(/(?:weaknesses?)["']?\s*:\s*\[(.*?)\]/is);
      const skillsMatch = analysis.match(/(?:keySkills?)["']?\s*:\s*\[(.*?)\]/is);
      const recommendationMatch = analysis.match(/(?:recommendation)["']?\s*:\s*["'](.*?)["']/is);

      const parseArray = (text) => {
        if (!text) return [];
        return text.split(/["'],\s*["']|",\s*"|'\s*,\s*'/)
          .map(s => s.replace(/^["'\s]+|["'\s]+$/g, ''))
          .filter(s => s.length > 0)
          .slice(0, 7);
      };

      result = {
        matchScore,
        skillScore: skillMatch ? parseInt(skillMatch[1]) : matchScore,
        experienceScore: expMatch ? parseInt(expMatch[1]) : matchScore - 5,
        educationScore: eduMatch ? parseInt(eduMatch[1]) : matchScore - 10,
        certificationScore: certMatch ? parseInt(certMatch[1]) : matchScore - 15,
        strengths: strengthsMatch ? parseArray(strengthsMatch[1]) : ['Has relevant experience', 'Shows technical competency', 'Good educational background'],
        weaknesses: weaknessesMatch ? parseArray(weaknessesMatch[1]) : ['May need additional training', 'Limited experience in some areas'],
        keySkills: skillsMatch ? parseArray(skillsMatch[1]) : ['Technical skills', 'Problem solving', 'Communication'],
        recommendation: recommendationMatch ? recommendationMatch[1].trim() : (matchScore >= 80 ? 'Highly Recommended for interview' : matchScore >= 60 ? 'Recommended for consideration' : 'May not be the best fit')
      };
    }

    console.log('Final result:', result);
    res.json(result);
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to screen CV',
      message: error.message 
    });
  }
});

// Career Roadmap
app.post('/api/ai/coach/roadmap', async (req, res) => {
  try {
    const { currentRole, targetRole, skills } = req.body;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a career planning expert. Create a detailed 6-month career roadmap with specific milestones, skills to learn, and actionable steps.'
        },
        {
          role: 'user',
          content: `Create a career roadmap from ${currentRole} to ${targetRole}. Current skills: ${skills}`
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.6,
      max_tokens: 800,
    });

    const roadmap = completion.choices[0]?.message?.content;

    res.json({
      roadmap: roadmap,
      milestones: [
        { month: 1, title: 'Foundation Skills', tasks: ['Learn basics', 'Complete online course'] },
        { month: 3, title: 'Intermediate Level', tasks: ['Build projects', 'Get certification'] },
        { month: 6, title: 'Job Ready', tasks: ['Portfolio complete', 'Start applying'] }
      ]
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate roadmap',
      message: error.message 
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'AI Career Coach' });
});

const PORT = process.env.PORT || 8091;
app.listen(PORT, () => {
  console.log(`🤖 AI Career Coach running on http://localhost:${PORT}`);
  console.log(`✅ Groq API configured`);
});
