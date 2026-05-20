# AI Resume Finalizer & ATS Optimizer

Upload a resume (PDF or DOCX), get an ATS compatibility score, and optimize your content with AI.

## Features

- **Resume parsing** — extracts text from PDF and DOCX files
- **ATS scoring** — formatting, structure, keyword match, and content quality
- **Job description matching** — paste a job posting to find missing keywords
- **AI optimization** — GPT-powered bullet rewrites and section improvements

## Setup

1. Install [Node.js 18+](https://nodejs.org/)

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the dev server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## Usage

1. Upload your resume (PDF or DOCX)
2. Optionally paste a job description for keyword matching
3. Click **Analyze ATS Score**
4. Review scores, issues, and missing keywords

## Tech stack

- Next.js 15 · React 19 · TypeScript · Tailwind CSS
- pdf-parse · mammoth · OpenAI API
