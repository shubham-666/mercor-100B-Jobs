import { Candidate } from '../types/candidate';

export const skillWeights: Record<string, number> = {
  // Technical Skills
  'React': 8,
  'Node.js': 7,
  'Python': 8,
  'TypeScript': 7,
  'AWS': 9,
  'Machine Learning': 10,
  'System Design': 9,
  'DevOps': 8,
  'Go': 7,
  'Kubernetes': 8,
  'Docker': 6,
  'PostgreSQL': 6,
  'Django': 6,
  
  // Leadership & Management
  'Leadership': 10,
  'Team Leadership': 9,
  'Team Scaling': 10,
  'Architecture': 9,
  
  // Product & Business
  'Product Strategy': 9,
  'User Research': 7,
  'Analytics': 7,
  'Sales Strategy': 8,
  'Growth Marketing': 8,
  'B2B Sales': 7,
  
  // Design
  'UI/UX Design': 8,
  'Figma': 6,
  'Design Systems': 7,
  'Prototyping': 6,
  
  // Data & AI
  'Statistics': 8,
  'Deep Learning': 9,
  'R': 6,
  
  // Other
  'Negotiation': 6,
  'SEO': 5,
  'Content Strategy': 5,
  'Security': 8,
  'Monitoring': 6,
  'CI/CD': 7,
  'Terraform': 7,
  'CRM': 5,
  'A/B Testing': 6,
  'SQL': 6,
  'Paid Ads': 5
};

export const calculateCandidateScore = (candidate: Candidate): number => {
  let score = 0;
  
  // Base experience score (0-30 points)
  const experienceScore = Math.min((candidate.experience_years || 0) * 2, 30);
  score += experienceScore;
  
  // Skills score (0-50 points)
  const skillsScore = (candidate.skills || []).reduce((total, skill) => {
    return total + (skillWeights[skill] || 3);
  }, 0);
  score += Math.min(skillsScore, 50);
  
  // Education bonus (0-10 points)
  const education = candidate.education?.toLowerCase() || '';
  if (education.includes('phd')) score += 10;
  else if (education.includes('mba') || education.includes('ms') || education.includes('master')) score += 7;
  else if (education.includes('bs') || education.includes('bachelor')) score += 5;
  
  // Previous experience quality (0-10 points)
  const prevExp = candidate.previous_experience?.toLowerCase() || '';
  if (prevExp.includes('google') || prevExp.includes('apple') || prevExp.includes('microsoft')) score += 10;
  else if (prevExp.includes('meta') || prevExp.includes('uber') || prevExp.includes('stripe')) score += 8;
  else if (prevExp.includes('startup') || prevExp.includes('scale')) score += 6;
  
  return Math.round(score);
};

export const getExperienceLevel = (years: number): string => {
  if (years <= 2) return 'Junior';
  if (years <= 5) return 'Mid-level';
  if (years <= 10) return 'Senior';
  return 'Principal/Executive';
};

export const getRoleCategory = (role: string): string => {
  const roleLower = role.toLowerCase();
  if (roleLower.includes('engineer') || roleLower.includes('developer')) return 'Engineering';
  if (roleLower.includes('manager') || roleLower.includes('director') || roleLower.includes('vp')) return 'Management';
  if (roleLower.includes('product')) return 'Product';
  if (roleLower.includes('design')) return 'Design';
  if (roleLower.includes('data') || roleLower.includes('scientist')) return 'Data';
  if (roleLower.includes('sales')) return 'Sales';
  if (roleLower.includes('marketing')) return 'Marketing';
  if (roleLower.includes('devops')) return 'DevOps';
  return 'Other';
};