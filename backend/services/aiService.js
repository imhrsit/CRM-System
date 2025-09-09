const { GoogleGenerativeAI } = require('@google/generative-ai');

class AIService {
    constructor() {
        if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
            this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            this.useGemini = true;
            console.log('Gemini AI initialized successfully');
        } else {
            this.useGemini = false;
            console.log('Gemini API key not configured. Using fallback scoring logic.');
        }
    }

    /**
     * Generate a conversion score for a lead based on their information
     * @param {Object} lead
     * @returns {Promise<number>}
     */

    async generateLeadScore(lead) {
        try {
            if (this.useGemini) {
                return await this.generateGeminiScore(lead);
            } else {
                return this.generateFallbackScore(lead);
            }
        } catch (error) {
            console.error('Error generating lead score:', error);
            return this.generateFallbackScore(lead);
        }
    }

    async generateGeminiScore(lead) {
        const prompt = `You are an expert sales lead scoring system. Analyze the following lead information and provide a conversion score from 0-100 (where 100 is most likely to convert).

Lead Information:
- Name: ${lead.name}
- Email: ${lead.email}
- Source: ${lead.source}
- Interest Level (1-10): ${lead.interestLevel}
- Description: ${lead.description}

Consider the following factors:
1. Interest level (higher = better score)
2. Email domain quality (business emails score higher than personal)
3. Source quality (referrals and direct inquiries score higher)
4. Description content (specific needs and budget mentions score higher)
5. Professional language and specificity in description

Respond with ONLY a number between 0-100. No explanation.`;

        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        const scoreText = response.text().trim();
        const score = parseInt(scoreText);
        
        if (isNaN(score) || score < 0 || score > 100) {
            console.warn('Invalid Gemini score response:', scoreText);
            return this.generateFallbackScore(lead);
        }

        console.log(`Gemini generated score: ${score} for lead: ${lead.name}`);
        return score;
    }

    generateFallbackScore(lead) {
        let score = 0;

        score += (lead.interestLevel || 0) * 4;

        if (lead.email) {
            const domain = lead.email.split('@')[1]?.toLowerCase();
            if (domain) {
                if (domain.includes('.com') && !this.isPersonalEmail(domain)) {
                    score += 20;
                } else if (domain.includes('.org') || domain.includes('.edu')) {
                    score += 15;
                } else if (this.isPersonalEmail(domain)) {
                    score += 5;
                } else {
                    score += 10;
                }
            }
        }

        const source = (lead.source || '').toLowerCase();
        if (source.includes('referral')) {
            score += 20;
        } else if (source.includes('direct') || source.includes('website')) {
            score += 15;
        } else if (source.includes('social')) {
            score += 10;
        } else if (source.includes('ad') || source.includes('campaign')) {
            score += 8;
        } else {
            score += 5;
        }

        const description = (lead.description || '').toLowerCase();
        let descriptionScore = 0;

        const highIntentKeywords = ['budget', 'purchase', 'buy', 'implement', 'urgent', 'asap', 'timeline'];
        const mediumIntentKeywords = ['interested', 'considering', 'looking', 'need', 'require'];
        const businessKeywords = ['company', 'business', 'team', 'organization', 'enterprise'];

        highIntentKeywords.forEach(keyword => {
            if (description.includes(keyword)) descriptionScore += 3;
        });

        mediumIntentKeywords.forEach(keyword => {
            if (description.includes(keyword)) descriptionScore += 2;
        });
        
        businessKeywords.forEach(keyword => {
            if (description.includes(keyword)) descriptionScore += 1;
        });
        if (description.length > 100) descriptionScore += 5;
        else if (description.length > 50) descriptionScore += 3;
        score += Math.min(descriptionScore, 20);
        return Math.max(0, Math.min(100, Math.round(score)));
    }

    isPersonalEmail(domain) {
        const personalDomains = [
            'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
            'icloud.com', 'aol.com', 'live.com', 'msn.com'
        ];
        return personalDomains.includes(domain);
    }
}

module.exports = new AIService();
