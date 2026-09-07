// Editorial mappings to official provider pages, reviewed 2026-09-07.
// A mapped course covers part of a skill category, not all requirements of a job.
export type LearningPath = {
  skill: string;
  title: string;
  provider: string;
  url: string;
  focus: string;
  prerequisite: string;
  proof: string;
  credential: string;
  credentialUrl: string;
  cost: string;
};

export const LEARNING_REVIEWED_AT = '2026-09-07';
export const LEARNING_PATHS: LearningPath[] = [
  {
    skill: 'python', title: 'CS50 Introduction to Programming with Python', provider: 'Harvard CS50',
    url: 'https://cs50.harvard.edu/python/',
    focus: 'Python functions, exceptions, file handling and unit tests.',
    prerequisite: 'An introductory route for learners building their programming foundations.',
    proof: 'Build a data importer with input validation, tests and a reproducible run. Explain its failure cases.',
    credential: 'Free CS50 course certificate after the required assessed work. Optional paid edX verification is separate; this is not an accredited Harvard qualification.',
    credentialUrl: 'https://cs50.harvard.edu/python/faqs/#how-do-i-get-my-free-cs50-certificate',
    cost: 'Free course and CS50 certificate',
  },
  {
    skill: 'ai-machine-learning', title: 'CS50 Introduction to Artificial Intelligence with Python', provider: 'Harvard CS50',
    url: 'https://cs50.harvard.edu/ai/',
    focus: 'Search, knowledge, uncertainty and machine learning through Python projects.',
    prerequisite: 'Prior programming experience in Python. Start with Python foundations if needed.',
    proof: 'Evaluate a model on held-out cases and report measured errors, limitations and reproducibility.',
    credential: 'Free CS50 course certificate after the required projects and quizzes. It does not establish production AI or agent reliability.',
    credentialUrl: 'https://cs50.harvard.edu/ai/certificate/', cost: 'Free course and CS50 certificate',
  },
  {
    skill: 'data-analytics', title: 'CS50 Introduction to Databases with SQL', provider: 'Harvard CS50',
    url: 'https://cs50.harvard.edu/sql/', focus: 'Querying, relational models, joins and database design.',
    prerequisite: 'An introductory database route. It covers SQL, not every analytics or data science requirement.',
    proof: 'Create a sourced dataset, document its schema and answer a question with reproducible queries and quality checks.',
    credential: 'Free CS50 course certificate after the required problem sets and final project.',
    credentialUrl: 'https://cs50.harvard.edu/sql/certificate/', cost: 'Free course and CS50 certificate',
  },
  {
    skill: 'typescript-javascript', title: 'Full Stack Open', provider: 'University of Helsinki',
    url: 'https://fullstackopen.com/en/', focus: 'JavaScript applications, React, Node.js and a TypeScript extension.',
    prerequisite: 'Programming experience, basic web and database knowledge, and Git.',
    proof: 'Ship a tested application with typed inputs, accessible UI and documented error handling.',
    credential: 'Free course certificates after the provider-required exercises. University credit has separate requirements.',
    credentialUrl: 'https://fullstackopen.com/en/part0/general_info/#certificate', cost: 'Free course and course certificates',
  },
  {
    skill: 'backend-systems', title: 'Full Stack Open', provider: 'University of Helsinki',
    url: 'https://fullstackopen.com/en/', focus: 'Node.js APIs, databases, testing and deployment.',
    prerequisite: 'Programming, web, database and Git foundations. This route does not cover all distributed systems work.',
    proof: 'Build an API with validation, authorization, persistence and tests for failures and retries.',
    credential: 'Free course certificates after required exercises. Use a backend project to demonstrate the relevant subset.',
    credentialUrl: 'https://fullstackopen.com/en/part0/general_info/#certificate', cost: 'Free course and course certificates',
  },
  {
    skill: 'security', title: 'CS50 Introduction to Cybersecurity', provider: 'Harvard CS50',
    url: 'https://cs50.harvard.edu/cybersecurity/', focus: 'Accounts, data, systems, software and privacy foundations.',
    prerequisite: 'A foundations route; specialist security engineering needs additional practical evidence.',
    proof: 'Threat-model an application you own, demonstrate a local vulnerability and verify the fix.',
    credential: 'Free CS50 course certificate after the required assignments and final project.',
    credentialUrl: 'https://cs50.harvard.edu/cybersecurity/certificate/', cost: 'Free course and CS50 certificate',
  },
  {
    skill: 'cloud-infrastructure', title: 'Cloud practitioner training', provider: 'AWS',
    url: 'https://aws.amazon.com/training/learn-about/cloud-practitioner/', focus: 'AWS cloud concepts, services and terminology.',
    prerequisite: 'Foundational cloud literacy. Cloud engineering roles require deeper implementation experience.',
    proof: 'Document a small service architecture with permissions, recovery and cost assumptions; use a local simulation if you have no cloud budget.',
    credential: 'Optional AWS Certified Cloud Practitioner exam. This is a foundational vendor certification, not proof of cloud engineering readiness.',
    credentialUrl: 'https://aws.amazon.com/certification/certified-cloud-practitioner/',
    cost: 'Provider lists learning options; optional exam and some training are paid. Check current terms; purchase is not required here.',
  },
];

export function learningForSkill(slug: string) {
  return LEARNING_PATHS.find(path => path.skill === slug);
}
