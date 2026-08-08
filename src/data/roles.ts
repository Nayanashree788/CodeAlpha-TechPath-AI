import { CareerRole } from '../types';

export const FRAMEWORK_DISCLAIMER =
  'Initial curated skill framework based on standard engineering expectations. Not derived from live job posting APIs.';

export const CAREER_ROLES_DATABASE: CareerRole[] = [
  {
    id: 'role_fullstack',
    name: 'Full Stack Developer',
    category: 'Software Development',
    description:
      'Engineers capable of building complete web applications from responsive frontends to database-driven REST APIs and cloud deployments.',
    frameworkType: 'curated_initial_framework',
    coreSkills: [
      { name: 'JavaScript', requiredLevel: 'Advanced', description: 'Core ES6+ language mastery, asynchronous patterns, and promises.' },
      { name: 'TypeScript', requiredLevel: 'Intermediate', description: 'Static typing, interface design, and type-safe APIs.' },
      { name: 'React', requiredLevel: 'Intermediate', description: 'Component state, hooks, lifecycle, and component architecture.' },
      { name: 'Node.js', requiredLevel: 'Intermediate', description: 'Express REST services, middleware, and async execution.' },
      { name: 'PostgreSQL', requiredLevel: 'Intermediate', description: 'Relational database schema, joins, indexing, and SQL queries.' },
      { name: 'Git', requiredLevel: 'Intermediate', description: 'Branching strategies, pull requests, and commit workflows.' },
    ],
    supportingSkills: [
      { name: 'HTML', requiredLevel: 'Advanced', description: 'Semantic markup and web accessibility basics.' },
      { name: 'CSS', requiredLevel: 'Intermediate', description: 'Tailwind CSS utility styling, Flexbox, and CSS Grid.' },
      { name: 'MongoDB', requiredLevel: 'Beginner', description: 'NoSQL document collections and CRUD aggregation.' },
      { name: 'Docker', requiredLevel: 'Beginner', description: 'Containerizing Node.js applications for cloud environments.' },
    ],
    advancedSkills: [
      { name: 'Next.js', requiredLevel: 'Intermediate', description: 'Server-side rendering, App Router, and full-stack React.' },
      { name: 'AWS', requiredLevel: 'Beginner', description: 'Cloud hosting using EC2, S3, and serverless functions.' },
      { name: 'Generative AI', requiredLevel: 'Beginner', description: 'Integrating Gemini/OpenAI SDK APIs into web products.' },
    ],
  },

  {
    id: 'role_frontend',
    name: 'Frontend Developer',
    category: 'Software Development',
    description:
      'Specializes in crafting fast, responsive, and visually accessible client-side user interfaces and state systems.',
    frameworkType: 'curated_initial_framework',
    coreSkills: [
      { name: 'JavaScript', requiredLevel: 'Advanced', description: 'DOM manipulation, ES6+ features, closures, and async JS.' },
      { name: 'TypeScript', requiredLevel: 'Intermediate', description: 'Type definitions, generics, and type-safe React props.' },
      { name: 'HTML', requiredLevel: 'Advanced', description: 'Semantic tags, forms, accessibility standards (WCAG).' },
      { name: 'CSS', requiredLevel: 'Advanced', description: 'Responsive layouts, Tailwind, animations, and container queries.' },
      { name: 'React', requiredLevel: 'Advanced', description: 'Hooks, Context API, state management, and performance optimization.' },
      { name: 'Git', requiredLevel: 'Intermediate', description: 'Version control, GitHub flow, and code reviews.' },
    ],
    supportingSkills: [
      { name: 'Next.js', requiredLevel: 'Intermediate', description: 'SSR, SSG, routing, and image optimization.' },
      { name: 'GitHub', requiredLevel: 'Intermediate', description: 'Continuous integration and GitHub Actions.' },
    ],
    advancedSkills: [
      { name: 'Node.js', requiredLevel: 'Beginner', description: 'Basic server awareness and API mocking.' },
    ],
  },

  {
    id: 'role_backend',
    name: 'Backend Developer',
    category: 'Software Development',
    description:
      'Focuses on backend services, server architecture, REST/GraphQL APIs, security, and database query optimization.',
    frameworkType: 'curated_initial_framework',
    coreSkills: [
      { name: 'Node.js', requiredLevel: 'Advanced', description: 'Express/Fastify frameworks, event loop, and microservices.' },
      { name: 'PostgreSQL', requiredLevel: 'Advanced', description: 'Database modeling, transactions, migrations, and performance tuning.' },
      { name: 'TypeScript', requiredLevel: 'Intermediate', description: 'Type-safe backend domain models and controllers.' },
      { name: 'MySQL', requiredLevel: 'Intermediate', description: 'Relational data queries and schema design.' },
      { name: 'Git', requiredLevel: 'Intermediate', description: 'Team version control and merge workflows.' },
    ],
    supportingSkills: [
      { name: 'Docker', requiredLevel: 'Intermediate', description: 'Multi-stage Dockerfiles and docker-compose setups.' },
      { name: 'MongoDB', requiredLevel: 'Intermediate', description: 'Document stores for flexible metadata.' },
      { name: 'Linux', requiredLevel: 'Intermediate', description: 'Bash commands, process management, and SSH.' },
    ],
    advancedSkills: [
      { name: 'AWS', requiredLevel: 'Intermediate', description: 'Cloud deployment, RDS, Lambda, and IAM security.' },
      { name: 'Application Security', requiredLevel: 'Intermediate', description: 'OWASP mitigation, JWT auth, and rate limiting.' },
    ],
  },

  {
    id: 'role_python',
    name: 'Python Developer',
    category: 'Software Development',
    description:
      'Builds backend web applications, automation toolkits, and data pipeline services using Python ecosystem frameworks.',
    frameworkType: 'curated_initial_framework',
    coreSkills: [
      { name: 'Python', requiredLevel: 'Advanced', description: 'OOP, decorators, generators, packaging, and async IO.' },
      { name: 'FastAPI', requiredLevel: 'Intermediate', description: 'Async REST APIs, Pydantic validation, and OpenAPI documentation.' },
      { name: 'PostgreSQL', requiredLevel: 'Intermediate', description: 'SQLAlchemy / Peewee ORMs and SQL query writing.' },
      { name: 'Git', requiredLevel: 'Intermediate', description: 'Version management and GitHub repositories.' },
    ],
    supportingSkills: [
      { name: 'Django', requiredLevel: 'Intermediate', description: 'MVT structure, Django ORM, and admin panel.' },
      { name: 'Flask', requiredLevel: 'Intermediate', description: 'Lightweight microservice REST routing.' },
      { name: 'Docker', requiredLevel: 'Beginner', description: 'Packaging Python services in Linux containers.' },
    ],
    advancedSkills: [
      { name: 'Pandas', requiredLevel: 'Intermediate', description: 'Data preprocessing and ETL scripts.' },
      { name: 'AWS', requiredLevel: 'Beginner', description: 'Cloud server hosting and serverless Lambda execution.' },
    ],
  },

  {
    id: 'role_java',
    name: 'Java Developer',
    category: 'Software Development',
    description:
      'Develops high-throughput enterprise backend platforms, microservices, and financial backend systems.',
    frameworkType: 'curated_initial_framework',
    coreSkills: [
      { name: 'Java', requiredLevel: 'Advanced', description: 'Java 17+, Multithreading, OOP design patterns, and JVM fundamentals.' },
      { name: 'Spring Boot', requiredLevel: 'Advanced', description: 'Spring MVC, Dependency Injection, Spring Data JPA, and REST.' },
      { name: 'MySQL', requiredLevel: 'Intermediate', description: 'Database indexing, transactions, and stored procedures.' },
      { name: 'Git', requiredLevel: 'Intermediate', description: 'Git workflow, feature branching, and PRs.' },
    ],
    supportingSkills: [
      { name: 'PostgreSQL', requiredLevel: 'Intermediate', description: 'Relational data modeling and ORM mappings.' },
      { name: 'Docker', requiredLevel: 'Intermediate', description: 'Containerizing Spring Boot JAR applications.' },
    ],
    advancedSkills: [
      { name: 'AWS', requiredLevel: 'Intermediate', description: 'Deploying microservices on ECS/EC2.' },
    ],
  },

  {
    id: 'role_ai_engineer',
    name: 'AI Engineer',
    category: 'AI & Data',
    description:
      'Integrates large language models, neural network pipelines, vector search, and AI APIs into production web systems.',
    frameworkType: 'curated_initial_framework',
    coreSkills: [
      { name: 'Python', requiredLevel: 'Advanced', description: 'Data structures, NumPy, async APIs, and package orchestration.' },
      { name: 'Generative AI', requiredLevel: 'Advanced', description: 'Gemini/OpenAI APIs, prompt engineering, and structured outputs.' },
      { name: 'LLMs', requiredLevel: 'Intermediate', description: 'RAG pipelines, vector embeddings, and LangChain/LlamaIndex.' },
      { name: 'Machine Learning', requiredLevel: 'Intermediate', description: 'Model evaluation, classification, and embeddings.' },
      { name: 'Git', requiredLevel: 'Intermediate', description: 'Repository management and collaborative development.' },
    ],
    supportingSkills: [
      { name: 'FastAPI', requiredLevel: 'Intermediate', description: 'Building AI service endpoints for web applications.' },
      { name: 'Deep Learning', requiredLevel: 'Intermediate', description: 'PyTorch models, fine-tuning, and neural networks.' },
      { name: 'TypeScript', requiredLevel: 'Beginner', description: 'Full-stack client integration with AI model backends.' },
    ],
    advancedSkills: [
      { name: 'Google Cloud', requiredLevel: 'Intermediate', description: 'Vertex AI, Cloud Run, and BigQuery ML.' },
      { name: 'NLP', requiredLevel: 'Intermediate', description: 'Text tokenization, sentiment analysis, and topic modeling.' },
    ],
  },

  {
    id: 'role_ml_engineer',
    name: 'Machine Learning Engineer',
    category: 'AI & Data',
    description:
      'Designs, trains, evaluates, and deploys scalable statistical and deep learning models into cloud production environments.',
    frameworkType: 'curated_initial_framework',
    coreSkills: [
      { name: 'Python', requiredLevel: 'Advanced', description: 'Data processing, NumPy, Pandas, and object-oriented PyTorch.' },
      { name: 'Machine Learning', requiredLevel: 'Advanced', description: 'Scikit-Learn, regression, decision trees, hyperparameter tuning.' },
      { name: 'Deep Learning', requiredLevel: 'Intermediate', description: 'PyTorch/TensorFlow, CNNs, Transformers, and training loops.' },
      { name: 'Pandas', requiredLevel: 'Advanced', description: 'DataFrame transformations, cleaning, and feature engineering.' },
      { name: 'Git', requiredLevel: 'Intermediate', description: 'Experiment tracking and code versioning.' },
    ],
    supportingSkills: [
      { name: 'NumPy', requiredLevel: 'Advanced', description: 'Matrix operations and vectorization.' },
      { name: 'Docker', requiredLevel: 'Intermediate', description: 'Packaging ML training containers.' },
      { name: 'FastAPI', requiredLevel: 'Intermediate', description: 'Exposing model inference endpoints.' },
    ],
    advancedSkills: [
      { name: 'Computer Vision', requiredLevel: 'Intermediate', description: 'OpenCV and object detection pipelines.' },
      { name: 'AWS', requiredLevel: 'Intermediate', description: 'SageMaker model deployment and S3 data lakes.' },
    ],
  },

  {
    id: 'role_data_scientist',
    name: 'Data Scientist',
    category: 'AI & Data',
    description:
      'Transforms complex raw datasets into predictive insights, statistical experiments, and algorithmic business recommendations.',
    frameworkType: 'curated_initial_framework',
    coreSkills: [
      { name: 'Python', requiredLevel: 'Advanced', description: 'Data analysis libraries, scripting, and scientific notebooks.' },
      { name: 'Pandas', requiredLevel: 'Advanced', description: 'ETL processing, aggregation, and data manipulation.' },
      { name: 'Machine Learning', requiredLevel: 'Intermediate', description: 'Predictive modeling, clustering, and regression analysis.' },
      { name: 'Data Analysis', requiredLevel: 'Advanced', description: 'Hypothesis testing, statistical distributions, and exploratory analysis.' },
      { name: 'PostgreSQL', requiredLevel: 'Intermediate', description: 'Complex SQL queries, window functions, and joins.' },
    ],
    supportingSkills: [
      { name: 'NumPy', requiredLevel: 'Intermediate', description: 'Array computations and linear algebra routines.' },
      { name: 'Power BI', requiredLevel: 'Intermediate', description: 'Interactive dashboard creation and reporting.' },
    ],
    advancedSkills: [
      { name: 'Deep Learning', requiredLevel: 'Intermediate', description: 'Neural network modeling.' },
      { name: 'Generative AI', requiredLevel: 'Beginner', description: 'AI text analysis and automated summary generation.' },
    ],
  },

  {
    id: 'role_data_analyst',
    name: 'Data Analyst',
    category: 'AI & Data',
    description:
      'Gathers business metrics, cleans datasets, writes SQL queries, and produces visual dashboards to guide decision-making.',
    frameworkType: 'curated_initial_framework',
    coreSkills: [
      { name: 'SQL / MySQL', requiredLevel: 'Advanced', description: 'Writing aggregate queries, CTEs, and JOIN operations.' },
      { name: 'Data Analysis', requiredLevel: 'Advanced', description: 'Data cleaning, metric calculation, and reporting.' },
      { name: 'Pandas', requiredLevel: 'Intermediate', description: 'Python data manipulation for automation.' },
      { name: 'Power BI', requiredLevel: 'Intermediate', description: 'Designing visual business dashboards.' },
    ],
    supportingSkills: [
      { name: 'Python', requiredLevel: 'Intermediate', description: 'Scripting data retrieval and cleaning.' },
      { name: 'Excel / Sheets', requiredLevel: 'Advanced', description: 'Pivot tables and financial modeling.' },
    ],
    advancedSkills: [
      { name: 'Machine Learning', requiredLevel: 'Beginner', description: 'Basic forecasting and trend estimation.' },
    ],
  },

  {
    id: 'role_cloud_engineer',
    name: 'Cloud Engineer',
    category: 'Cloud & Infrastructure',
    description:
      'Architects, deploys, and maintains secure, scalable cloud infrastructure and server resources across AWS/GCP/Azure.',
    frameworkType: 'curated_initial_framework',
    coreSkills: [
      { name: 'AWS', requiredLevel: 'Intermediate', description: 'EC2, S3, VPC, Lambda, IAM, and CloudWatch administration.' },
      { name: 'Linux', requiredLevel: 'Advanced', description: 'System administration, bash scripts, and networking commands.' },
      { name: 'Docker', requiredLevel: 'Intermediate', description: 'Building and optimizing container images.' },
      { name: 'Git', requiredLevel: 'Intermediate', description: 'Infrastructure as Code repository management.' },
    ],
    supportingSkills: [
      { name: 'Google Cloud', requiredLevel: 'Intermediate', description: 'Cloud Run, IAM, and Cloud SQL configuration.' },
      { name: 'Python', requiredLevel: 'Intermediate', description: 'Automation scripts and boto3 SDK usage.' },
    ],
    advancedSkills: [
      { name: 'Azure', requiredLevel: 'Intermediate', description: 'Enterprise cloud services.' },
      { name: 'Network Security', requiredLevel: 'Intermediate', description: 'VPC peering, firewalls, and ingress control.' },
    ],
  },

  {
    id: 'role_devops',
    name: 'DevOps Engineer',
    category: 'Cloud & Infrastructure',
    description:
      'Automates CI/CD deployment pipelines, infrastructure automation, container orchestration, and site reliability.',
    frameworkType: 'curated_initial_framework',
    coreSkills: [
      { name: 'Docker', requiredLevel: 'Advanced', description: 'Container optimization, multi-stage builds, and orchestration.' },
      { name: 'Linux', requiredLevel: 'Advanced', description: 'Shell scripting, system security, performance monitoring.' },
      { name: 'GitHub', requiredLevel: 'Advanced', description: 'GitHub Actions CI/CD pipeline automation.' },
      { name: 'AWS', requiredLevel: 'Intermediate', description: 'Cloud server provisioning and auto-scaling.' },
      { name: 'Git', requiredLevel: 'Advanced', description: 'Branch management and automated release tagging.' },
    ],
    supportingSkills: [
      { name: 'Python', requiredLevel: 'Intermediate', description: 'Automation scripts and API hooks.' },
      { name: 'Google Cloud', requiredLevel: 'Intermediate', description: 'Container deployment on Cloud Run.' },
    ],
    advancedSkills: [
      { name: 'Application Security', requiredLevel: 'Intermediate', description: 'DevSecOps vulnerability scanning in pipelines.' },
    ],
  },

  {
    id: 'role_cybersecurity',
    name: 'Cybersecurity Analyst',
    category: 'Cybersecurity',
    description:
      'Monitors corporate network traffic, detects threats, investigates security incidents, and enforces security compliance.',
    frameworkType: 'curated_initial_framework',
    coreSkills: [
      { name: 'Network Security', requiredLevel: 'Advanced', description: 'Packet inspection, Wireshark, firewalls, and VPN protocols.' },
      { name: 'Linux', requiredLevel: 'Advanced', description: 'Kali Linux tools, log auditing, and command-line forensics.' },
      { name: 'Ethical Hacking', requiredLevel: 'Intermediate', description: 'Penetration testing fundamentals and port scanning.' },
      { name: 'Python', requiredLevel: 'Intermediate', description: 'Security scripting and automated log parsing.' },
    ],
    supportingSkills: [
      { name: 'Application Security', requiredLevel: 'Intermediate', description: 'OWASP vulnerability identification.' },
      { name: 'Git', requiredLevel: 'Intermediate', description: 'Auditing code repositories for secrets.' },
    ],
    advancedSkills: [
      { name: 'AWS', requiredLevel: 'Beginner', description: 'Cloud security monitoring and IAM role policies.' },
    ],
  },

  {
    id: 'role_security_engineer',
    name: 'Security Engineer',
    category: 'Cybersecurity',
    description:
      'Engineers defensive security tools, cryptography mechanisms, secure coding guidelines, and vulnerability remediation.',
    frameworkType: 'curated_initial_framework',
    coreSkills: [
      { name: 'Application Security', requiredLevel: 'Advanced', description: 'SAST/DAST, static analysis, threat modeling, and secure coding.' },
      { name: 'Network Security', requiredLevel: 'Advanced', description: 'Zero trust architecture, TLS/SSL, and cryptographic protocols.' },
      { name: 'Linux', requiredLevel: 'Advanced', description: 'Hardening Linux kernels, SELinux, and permission policies.' },
      { name: 'Python', requiredLevel: 'Intermediate', description: 'Building security tools and automated exploit verification.' },
    ],
    supportingSkills: [
      { name: 'C++', requiredLevel: 'Intermediate', description: 'Memory safety vulnerability analysis (buffer overflows).' },
      { name: 'Docker', requiredLevel: 'Intermediate', description: 'Container security scanning and image signing.' },
    ],
    advancedSkills: [
      { name: 'Ethical Hacking', requiredLevel: 'Advanced', description: 'Red teaming and exploit payload analysis.' },
    ],
  },
];

export function getRoleByName(roleName: string): CareerRole | undefined {
  return CAREER_ROLES_DATABASE.find(
    (r) => r.name.toLowerCase() === roleName.toLowerCase() || r.id === roleName
  );
}

export function getAllRoleNames(): string[] {
  return CAREER_ROLES_DATABASE.map((r) => r.name);
}
