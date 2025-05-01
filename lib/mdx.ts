import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { serialize } from 'next-mdx-remote/serialize'
import { remark } from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'content/posts')

// Types
export interface Post {
  slug?: string;
  title?: string;
  date?: string;
  excerpt?: string;
  author?: string;
  categories?: string[];
  featuredImage?: string;
  content?: string;
}

// Get all post slugs
export function getPostSlugs() {
  try {
    return fs.readdirSync(postsDirectory).filter(file => file.endsWith('.mdx'))
  } catch (error) {
    console.error('Error getting post slugs:', error)
    return []
  }
}

// Get post by slug
export async function getPostBySlug(slug: string) {
  try {
    const realSlug = slug.replace(/\.mdx$/, '')
    const fullPath = path.join(postsDirectory, `${realSlug}.mdx`)
    
    if (!fs.existsSync(fullPath)) {
      return null
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)
    
    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
      .use(html)
      .process(content)
    const contentHtml = processedContent.toString()
    
    // Serialize MDX content
    const mdxSource = await serialize(content, {
      // MDX options
      scope: data,
    })
    
    return {
      slug: realSlug,
      frontMatter: data,
      content,
      contentHtml,
      mdxSource,
    }
  } catch (error) {
    console.error(`Error getting post by slug '${slug}':`, error)
    return null
  }
}

// Get all posts with frontmatter
export async function getPosts(limit?: number) {
  try {
    const slugs = getPostSlugs()
    const posts = await Promise.all(
      slugs.map(async (slug) => {
        const post = await getPostBySlug(slug)
        return post ? {
          slug: post.slug,
          ...post.frontMatter,
        } : null
      })
    )
    
    // Отфильтровать null значения
    const validPosts = posts.filter(post => post !== null) as Post[];
    
    // Sort posts by date in descending order
    const sortedPosts = validPosts.sort((a, b) => {
      if (a.date && b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      }
      return 0
    })
    
    // Return all posts or limit if specified
    return limit ? sortedPosts.slice(0, limit) : sortedPosts
  } catch (error) {
    console.error('Error getting all posts:', error)
    return []
  }
}
