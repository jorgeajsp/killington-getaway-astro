/**
 * Convert blog posts from Next.js format to Astro Markdown
 *
 * Reads from: /Users/Jorge/Sites/repos/killington-getaway/app/blog/[slug]/page.js
 * Writes to: /Users/Jorge/Sites/repos/killington-getaway-astro/src/content/blog/*.md
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read the blog posts file
const blogPostsPath = '/Users/Jorge/Sites/repos/killington-getaway/app/blog/[slug]/page.js';
const outputDir = path.join(__dirname, '../src/content/blog');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Read and parse the blog posts file
const fileContent = fs.readFileSync(blogPostsPath, 'utf-8');

// Extract the BLOG_POSTS object
const blogPostsMatch = fileContent.match(/const BLOG_POSTS = \{([\s\S]*?)\n\}/);
if (!blogPostsMatch) {
  console.error('Could not find BLOG_POSTS object');
  process.exit(1);
}

// Function to convert content array to Markdown
function convertContentToMarkdown(content) {
  let markdown = '';

  for (const block of content) {
    switch (block.type) {
      case 'p':
        markdown += `${block.text}\n\n`;
        break;

      case 'h2':
        markdown += `## ${block.text}\n\n`;
        break;

      case 'h3':
        markdown += `### ${block.text}\n\n`;
        break;

      case 'html':
        // Keep HTML blocks as-is
        markdown += `${block.text}\n\n`;
        break;

      case 'stats':
        // Convert stats to a table or list
        markdown += '| Label | Value |\n';
        markdown += '|-------|-------|\n';
        for (const item of block.items) {
          markdown += `| ${item.label} | ${item.value} |\n`;
        }
        markdown += '\n';
        break;

      case 'callout':
        // Convert callout to a blockquote or custom component
        markdown += `> **${block.title}**\n>\n`;
        markdown += `> ${block.text}\n\n`;
        break;

      case 'faq':
        // Convert FAQ to a list
        markdown += '## Frequently Asked Questions\n\n';
        for (const item of block.items) {
          markdown += `**${item.q}**\n\n${item.a}\n\n`;
        }
        break;

      default:
        console.warn(`Unknown block type: ${block.type}`);
    }
  }

  return markdown.trim();
}

// Function to extract and convert a single blog post
function extractBlogPost(slug, postContent) {
  try {
    // Extract metadata
    const titleMatch = postContent.match(/title:\s*['"](.+?)['"]/);
    const categoryMatch = postContent.match(/category:\s*['"](.+?)['"]/);
    const dateMatch = postContent.match(/date:\s*['"](.+?)['"]/);
    const authorMatch = postContent.match(/author:\s*['"](.+?)['"]/);
    const imgMatch = postContent.match(/img:\s*['"](.+?)['"]/);
    const imgCreditMatch = postContent.match(/imgCredit:\s*['"](.+?)['"]/);

    if (!titleMatch || !categoryMatch || !dateMatch) {
      console.error(`Missing required metadata for ${slug}`);
      return null;
    }

    // Extract content array
    const contentMatch = postContent.match(/content:\s*\[([\s\S]*?)\]\s*,?\s*\}/);
    if (!contentMatch) {
      console.error(`Could not find content array for ${slug}`);
      return null;
    }

    // Parse content blocks (this is simplified - you may need to adjust)
    const contentStr = contentMatch[1];
    const content = [];

    // Use a regex to match content blocks
    const blockRegex = /\{\s*type:\s*['"](\w+)['"]\s*,\s*text:\s*['"](.+?)['"]\s*\}/gs;
    let match;
    while ((match = blockRegex.exec(contentStr)) !== null) {
      content.push({
        type: match[1],
        text: match[2].replace(/\\'/g, "'").replace(/\\"/g, '"')
      });
    }

    // Get excerpt from blog-posts.js
    const blogPostsData = fs.readFileSync('/Users/Jorge/Sites/repos/killington-getaway/app/data/blog-posts.js', 'utf-8');
    const excerptMatch = blogPostsData.match(new RegExp(`slug:\\s*['"]${slug}['"].*?excerpt:\\s*['"](.+?)['"]`, 's'));
    const excerpt = excerptMatch ? excerptMatch[1] : titleMatch[1];

    // Create frontmatter
    const frontmatter = {
      title: titleMatch[1],
      excerpt: excerpt,
      category: categoryMatch[1],
      date: dateMatch[1],
      author: authorMatch ? authorMatch[1] : 'KG Reporter',
      image: imgMatch ? imgMatch[1] : '',
      imageCredit: imgCreditMatch ? imgCreditMatch[1] : undefined,
      draft: false
    };

    // Convert content to Markdown
    const markdownContent = content.length > 0 ? convertContentToMarkdown(content) : '';

    // Create the full Markdown file
    let markdownFile = '---\n';
    for (const [key, value] of Object.entries(frontmatter)) {
      if (value !== undefined) {
        if (typeof value === 'string') {
          // Escape quotes in strings
          const escapedValue = value.replace(/"/g, '\\"');
          markdownFile += `${key}: "${escapedValue}"\n`;
        } else {
          markdownFile += `${key}: ${value}\n`;
        }
      }
    }
    markdownFile += '---\n\n';
    markdownFile += markdownContent;

    return markdownFile;
  } catch (error) {
    console.error(`Error processing ${slug}:`, error);
    return null;
  }
}

// Parse all blog posts
const slugMatches = fileContent.matchAll(/['"]([a-z0-9-]+)['"]:\s*\{/g);
const slugs = Array.from(slugMatches).map(m => m[1]);

console.log(`Found ${slugs.length} blog posts to convert`);

let convertedCount = 0;
for (const slug of slugs) {
  // Extract the post content
  const postRegex = new RegExp(`['"]${slug}['"]:\\s*\\{([\\s\\S]*?)\\n\\s*\\},?\\n`, 'g');
  const postMatch = postRegex.exec(fileContent);

  if (!postMatch) {
    console.warn(`Could not extract content for ${slug}`);
    continue;
  }

  const postContent = postMatch[1];
  const markdown = extractBlogPost(slug, postContent);

  if (markdown) {
    const outputPath = path.join(outputDir, `${slug}.md`);
    fs.writeFileSync(outputPath, markdown);
    console.log(`✓ Converted ${slug}`);
    convertedCount++;
  } else {
    console.error(`✗ Failed to convert ${slug}`);
  }
}

console.log(`\nConversion complete: ${convertedCount}/${slugs.length} posts converted`);
