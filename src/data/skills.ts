import { SkillCategory } from '../types';

export interface CatalogSkill {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
  popularForRoles: string[];
  prerequisites?: string[];
}

export const CENTRAL_SKILL_DATABASE: CatalogSkill[] = [
  // Programming
  {
    id: 'sk_python',
    name: 'Python',
    category: 'Programming',
    description: 'Versatile language popular in web dev, AI/ML, data science, and scripting.',
    popularForRoles: ['Python Developer', 'AI Engineer', 'Machine Learning Engineer', 'Data Scientist', 'Data Analyst', 'Backend Developer'],
  },
  {
    id: 'sk_java',
    name: 'Java',
    category: 'Programming',
    description: 'Object-oriented language widely used for enterprise backends and Android development.',
    popularForRoles: ['Java Developer', 'Backend Developer', 'Full Stack Developer'],
  },
  {
    id: 'sk_c',
    name: 'C',
    category: 'Programming',
    description: 'Procedural systems programming language foundational for computing.',
    popularForRoles: ['Embedded Systems', 'Security Engineer', 'Software Engineer'],
  },
  {
    id: 'sk_cpp',
    name: 'C++',
    category: 'Programming',
    description: 'High-performance object-oriented language for game dev, systems, and algorithms.',
    popularForRoles: ['Software Engineer', 'Security Engineer', 'Game Developer'],
  },
  {
    id: 'sk_javascript',
    name: 'JavaScript',
    category: 'Programming',
    description: 'Essential language of the modern web for dynamic client-side and server-side interfaces.',
    popularForRoles: ['Frontend Developer', 'Full Stack Developer', 'Backend Developer'],
  },
  {
    id: 'sk_typescript',
    name: 'TypeScript',
    category: 'Programming',
    description: 'Typed superset of JavaScript providing static types and enhanced developer tooling.',
    popularForRoles: ['Frontend Developer', 'Full Stack Developer', 'Backend Developer'],
    prerequisites: ['JavaScript'],
  },

  // Frontend
  {
    id: 'sk_html',
    name: 'HTML',
    category: 'Frontend',
    description: 'Standard markup language for web page structure and accessibility.',
    popularForRoles: ['Frontend Developer', 'Full Stack Developer'],
  },
  {
    id: 'sk_css',
    name: 'CSS',
    category: 'Frontend',
    description: 'Style sheet language for layout, responsive design, and animations.',
    popularForRoles: ['Frontend Developer', 'Full Stack Developer'],
    prerequisites: ['HTML'],
  },
  {
    id: 'sk_react',
    name: 'React',
    category: 'Frontend',
    description: 'Component-based UI library for building responsive interactive web interfaces.',
    popularForRoles: ['Frontend Developer', 'Full Stack Developer'],
    prerequisites: ['JavaScript', 'HTML', 'CSS'],
  },
  {
    id: 'sk_nextjs',
    name: 'Next.js',
    category: 'Frontend',
    description: 'React framework providing server-side rendering, static generation, and API routes.',
    popularForRoles: ['Frontend Developer', 'Full Stack Developer'],
    prerequisites: ['React', 'TypeScript'],
  },

  // Backend
  {
    id: 'sk_restapis',
    name: 'REST APIs',
    category: 'Backend',
    description: 'HTTP protocol fundamentals, REST architectural principles, JSON data payloads, and status codes.',
    popularForRoles: ['Backend Developer', 'Frontend Developer', 'Full Stack Developer', 'AI Engineer'],
    prerequisites: ['JavaScript'],
  },
  {
    id: 'sk_nodejs',
    name: 'Node.js',
    category: 'Backend',
    description: 'Asynchronous event-driven JavaScript runtime for scalable backend services.',
    popularForRoles: ['Backend Developer', 'Full Stack Developer'],
    prerequisites: ['JavaScript', 'REST APIs'],
  },
  {
    id: 'sk_auth',
    name: 'Authentication & Security',
    category: 'Backend',
    description: 'User authentication, JWT tokens, OAuth2, session management, and password hashing.',
    popularForRoles: ['Backend Developer', 'Full Stack Developer', 'Security Engineer'],
    prerequisites: ['REST APIs'],
  },
  {
    id: 'sk_sysdesign',
    name: 'System Design',
    category: 'Backend',
    description: 'Scalable system architecture, caching, load balancing, message queues, and database sharding.',
    popularForRoles: ['Backend Developer', 'Full Stack Developer', 'Cloud Engineer'],
    prerequisites: ['PostgreSQL', 'REST APIs'],
  },
  {
    id: 'sk_deployment',
    name: 'Deployment & CI/CD',
    category: 'DevOps',
    description: 'Deploying web applications to Cloud Run/Vercel/AWS, environment variables, and automated build pipelines.',
    popularForRoles: ['Full Stack Developer', 'DevOps Engineer', 'Frontend Developer'],
    prerequisites: ['Git', 'Docker'],
  },
  {
    id: 'sk_django',
    name: 'Django',
    category: 'Backend',
    description: 'High-level Python web framework encouraging rapid development and clean design.',
    popularForRoles: ['Python Developer', 'Backend Developer', 'Full Stack Developer'],
    prerequisites: ['Python'],
  },
  {
    id: 'sk_flask',
    name: 'Flask',
    category: 'Backend',
    description: 'Lightweight WSGI Python microframework for API microservices.',
    popularForRoles: ['Python Developer', 'Backend Developer'],
    prerequisites: ['Python'],
  },
  {
    id: 'sk_fastapi',
    name: 'FastAPI',
    category: 'Backend',
    description: 'Modern high-performance Python web framework for building REST APIs with auto-generated OpenAPI docs.',
    popularForRoles: ['Python Developer', 'AI Engineer', 'Backend Developer'],
    prerequisites: ['Python'],
  },
  {
    id: 'sk_springboot',
    name: 'Spring Boot',
    category: 'Backend',
    description: 'Enterprise Java framework for production-ready stand-alone REST services.',
    popularForRoles: ['Java Developer', 'Backend Developer'],
    prerequisites: ['Java'],
  },

  // Database
  {
    id: 'sk_mysql',
    name: 'MySQL',
    category: 'Database',
    description: 'Popular open-source relational database management system using SQL.',
    popularForRoles: ['Backend Developer', 'Full Stack Developer', 'Data Analyst'],
  },
  {
    id: 'sk_postgresql',
    name: 'PostgreSQL',
    category: 'Database',
    description: 'Advanced open-source relational database known for reliability and extensible features.',
    popularForRoles: ['Backend Developer', 'Full Stack Developer', 'Data Engineer'],
  },
  {
    id: 'sk_mongodb',
    name: 'MongoDB',
    category: 'Database',
    description: 'NoSQL document database designed for modern JSON-like data models.',
    popularForRoles: ['Full Stack Developer', 'Backend Developer'],
  },
  {
    id: 'sk_sqlite',
    name: 'SQLite',
    category: 'Database',
    description: 'Self-contained serverless SQL database engine popular for mobile and embedded apps.',
    popularForRoles: ['Mobile Developer', 'Python Developer', 'Backend Developer'],
  },

  // AI & Machine Learning
  {
    id: 'sk_ml',
    name: 'Machine Learning',
    category: 'AI & Machine Learning',
    description: 'Core supervised and unsupervised learning algorithms, model training, and metrics evaluation.',
    popularForRoles: ['Machine Learning Engineer', 'AI Engineer', 'Data Scientist'],
    prerequisites: ['Python', 'Pandas'],
  },
  {
    id: 'sk_dl',
    name: 'Deep Learning',
    category: 'AI & Machine Learning',
    description: 'Neural networks, PyTorch/TensorFlow, CNNs, and sequence models.',
    popularForRoles: ['Machine Learning Engineer', 'AI Engineer', 'Data Scientist'],
    prerequisites: ['Machine Learning', 'Python'],
  },
  {
    id: 'sk_genai',
    name: 'Generative AI',
    category: 'AI & Machine Learning',
    description: 'LLM integrations, prompt engineering, RAG architecture, and modern AI APIs.',
    popularForRoles: ['AI Engineer', 'Full Stack Developer'],
    prerequisites: ['Python', 'TypeScript'],
  },
  {
    id: 'sk_llms',
    name: 'LLMs',
    category: 'AI & Machine Learning',
    description: 'Large Language Models fine-tuning, orchestration with LangChain, and structured output parsing.',
    popularForRoles: ['AI Engineer', 'Machine Learning Engineer'],
    prerequisites: ['Generative AI', 'Python'],
  },
  {
    id: 'sk_nlp',
    name: 'NLP',
    category: 'AI & Machine Learning',
    description: 'Natural Language Processing techniques including tokenization, embeddings, and sentiment analysis.',
    popularForRoles: ['AI Engineer', 'Data Scientist'],
    prerequisites: ['Python', 'Machine Learning'],
  },
  {
    id: 'sk_cv',
    name: 'Computer Vision',
    category: 'AI & Machine Learning',
    description: 'Image processing, OpenCV, object detection, and vision models.',
    popularForRoles: ['AI Engineer', 'Machine Learning Engineer'],
    prerequisites: ['Deep Learning', 'Python'],
  },

  // Data
  {
    id: 'sk_data_analysis',
    name: 'Data Analysis',
    category: 'Data',
    description: 'Exploratory data analysis, statistical methods, hypothesis testing, and reporting.',
    popularForRoles: ['Data Analyst', 'Data Scientist'],
  },
  {
    id: 'sk_pandas',
    name: 'Pandas',
    category: 'Data',
    description: 'Data manipulation and analysis library for Python providing DataFrames.',
    popularForRoles: ['Data Analyst', 'Data Scientist', 'Python Developer'],
    prerequisites: ['Python'],
  },
  {
    id: 'sk_numpy',
    name: 'NumPy',
    category: 'Data',
    description: 'Fundamental package for scientific computing with multi-dimensional arrays in Python.',
    popularForRoles: ['Data Scientist', 'Machine Learning Engineer'],
    prerequisites: ['Python'],
  },
  {
    id: 'sk_powerbi',
    name: 'Power BI',
    category: 'Data',
    description: 'Business analytics service providing interactive visualizations and business intelligence reports.',
    popularForRoles: ['Data Analyst'],
  },

  // Cloud
  {
    id: 'sk_aws',
    name: 'AWS',
    category: 'Cloud',
    description: 'Amazon Web Services cloud computing suite (EC2, S3, IAM, CloudRun/ECS, Lambda).',
    popularForRoles: ['Cloud Engineer', 'DevOps Engineer', 'Backend Developer'],
  },
  {
    id: 'sk_azure',
    name: 'Azure',
    category: 'Cloud',
    description: 'Microsoft enterprise cloud platform services and infrastructure.',
    popularForRoles: ['Cloud Engineer', 'DevOps Engineer'],
  },
  {
    id: 'sk_gcp',
    name: 'Google Cloud',
    category: 'Cloud',
    description: 'Google Cloud Platform hosting services including Cloud Run, BigQuery, and Vertex AI.',
    popularForRoles: ['Cloud Engineer', 'AI Engineer', 'DevOps Engineer'],
  },

  // DevOps & Tools
  {
    id: 'sk_docker',
    name: 'Docker',
    category: 'DevOps',
    description: 'Containerization platform to package applications and dependencies consistently.',
    popularForRoles: ['DevOps Engineer', 'Cloud Engineer', 'Backend Developer', 'Full Stack Developer'],
  },
  {
    id: 'sk_linux',
    name: 'Linux',
    category: 'DevOps',
    description: 'Command line terminal navigation, shell scripting, and server administration.',
    popularForRoles: ['DevOps Engineer', 'Cybersecurity Analyst', 'Backend Developer', 'Cloud Engineer'],
  },
  {
    id: 'sk_git',
    name: 'Git',
    category: 'Tools',
    description: 'Distributed version control system for tracking source code changes.',
    popularForRoles: ['All Developers'],
  },
  {
    id: 'sk_github',
    name: 'GitHub',
    category: 'Tools',
    description: 'Cloud repository hosting, Pull Requests, code review, and GitHub Actions CI/CD.',
    popularForRoles: ['All Developers'],
    prerequisites: ['Git'],
  },

  // Cybersecurity
  {
    id: 'sk_netsec',
    name: 'Network Security',
    category: 'Cybersecurity',
    description: 'Firewalls, VPNs, protocols (TCP/IP, TLS), intrusion detection, and network analysis.',
    popularForRoles: ['Cybersecurity Analyst', 'Security Engineer'],
  },
  {
    id: 'sk_ethicalhacking',
    name: 'Ethical Hacking',
    category: 'Cybersecurity',
    description: 'Penetration testing techniques, vulnerability scanning, and security audits.',
    popularForRoles: ['Cybersecurity Analyst', 'Security Engineer'],
    prerequisites: ['Linux', 'Network Security'],
  },
  {
    id: 'sk_appsec',
    name: 'Application Security',
    category: 'Cybersecurity',
    description: 'OWASP Top 10 vulnerabilities, secure coding practices, authentication, and SAST/DAST.',
    popularForRoles: ['Security Engineer', 'Backend Developer'],
    prerequisites: ['Network Security'],
  },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  'Programming',
  'Frontend',
  'Backend',
  'Database',
  'AI & Machine Learning',
  'Data',
  'Cloud',
  'DevOps',
  'Cybersecurity',
  'Tools',
];
