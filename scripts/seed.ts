import { db } from '../src/database/connection';
import { users, categories, posts, comments, postCategories, refreshTokens } from '../src/database/schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

// Sample data for seeding
const sampleUsers = [
    {
        email: 'admin@example.com',
        username: 'admin',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isVerified: true,
    },
    {
        email: 'john.doe@example.com',
        username: 'johndoe',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'user',
        isVerified: true,
    },
    {
        email: 'jane.smith@example.com',
        username: 'janesmith',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'user',
        isVerified: true,
    },
    {
        email: 'bob.wilson@example.com',
        username: 'bobwilson',
        password: 'password123',
        firstName: 'Bob',
        lastName: 'Wilson',
        role: 'user',
        isVerified: false,
    },
];

const sampleCategories = [
    {
        name: 'Technology',
        slug: 'technology',
        description: 'Articles about technology, programming, and software development',
    },
    {
        name: 'Business',
        slug: 'business',
        description: 'Business insights, entrepreneurship, and management topics',
    },
    {
        name: 'Lifestyle',
        slug: 'lifestyle',
        description: 'Health, wellness, and lifestyle articles',
    },
    {
        name: 'Travel',
        slug: 'travel',
        description: 'Travel guides, tips, and destination reviews',
    },
    {
        name: 'Food',
        slug: 'food',
        description: 'Recipes, restaurant reviews, and culinary adventures',
    },
];

const samplePosts = [
    {
        title: 'Getting Started with Node.js and TypeScript',
        content: `Node.js has become one of the most popular platforms for building scalable web applications. When combined with TypeScript, you get the benefits of static typing and better tooling support.

In this comprehensive guide, we'll explore how to set up a Node.js project with TypeScript, including:
- Setting up the development environment
- Configuring TypeScript compiler
- Using modern ES6+ features
- Best practices for project structure
- Testing strategies

TypeScript provides excellent IntelliSense support and catches many errors at compile time, making your development experience much more productive.`,
        excerpt: 'Learn how to set up a Node.js project with TypeScript for better development experience and type safety.',
        slug: 'getting-started-with-nodejs-typescript',
        status: 'published',
        isPublished: true,
        featuredImage: 'https://example.com/images/nodejs-typescript.jpg',
        viewCount: 1250,
    },
    {
        title: 'Building RESTful APIs with Express.js',
        content: `Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.

In this tutorial, we'll build a complete RESTful API using Express.js, covering:
- Setting up Express.js project
- Creating routes and middleware
- Database integration with Drizzle ORM
- Authentication and authorization
- Error handling and validation
- API documentation

We'll also cover best practices for production deployment and security considerations.`,
        excerpt: 'A comprehensive guide to building RESTful APIs using Express.js with proper structure and best practices.',
        slug: 'building-restful-apis-expressjs',
        status: 'published',
        isPublished: true,
        featuredImage: 'https://example.com/images/express-api.jpg',
        viewCount: 890,
    },
    {
        title: 'Database Design Best Practices',
        content: `Good database design is crucial for the performance and maintainability of your application. In this article, we'll explore key principles and best practices for designing efficient databases.

Topics covered include:
- Normalization and denormalization
- Indexing strategies
- Relationship design
- Performance optimization
- Data integrity constraints
- Scalability considerations

We'll use PostgreSQL as our example database and discuss how to implement these concepts effectively.`,
        excerpt: 'Learn essential database design principles and best practices for building scalable applications.',
        slug: 'database-design-best-practices',
        status: 'published',
        isPublished: true,
        featuredImage: 'https://example.com/images/database-design.jpg',
        viewCount: 567,
    },
    {
        title: 'Docker for Development and Production',
        content: `Docker has revolutionized how we deploy and manage applications. In this guide, we'll explore how to use Docker for both development and production environments.

We'll cover:
- Setting up Docker development environment
- Creating efficient Dockerfiles
- Using Docker Compose for local development
- Production deployment strategies
- Security best practices
- Performance optimization

This guide will help you containerize your Node.js applications effectively.`,
        excerpt: 'A complete guide to using Docker for Node.js application development and production deployment.',
        slug: 'docker-development-production',
        status: 'draft',
        isPublished: false,
        featuredImage: 'https://example.com/images/docker.jpg',
        viewCount: 0,
    },
    {
        title: 'Modern JavaScript Features You Should Know',
        content: `JavaScript has evolved significantly with ES6+ features. In this article, we'll explore the most important modern JavaScript features that every developer should know.

Key features covered:
- Arrow functions and lexical scoping
- Destructuring and spread operators
- Template literals
- Async/await and Promises
- Modules and imports
- Optional chaining and nullish coalescing

These features make JavaScript more powerful and expressive, leading to cleaner and more maintainable code.`,
        excerpt: 'Explore essential modern JavaScript features that will improve your coding productivity and code quality.',
        slug: 'modern-javascript-features',
        status: 'published',
        isPublished: true,
        featuredImage: 'https://example.com/images/modern-js.jpg',
        viewCount: 2340,
    },
];

const sampleComments = [
    {
        content: 'Great article! The TypeScript setup guide was very helpful. I especially liked the section on configuring the compiler options.',
        isApproved: true,
    },
    {
        content: 'This helped me get started with Node.js and TypeScript quickly. The examples are clear and well-explained.',
        isApproved: true,
    },
    {
        content: 'I have a question about the database connection setup. Could you provide more details about connection pooling?',
        isApproved: true,
    },
    {
        content: 'Excellent guide on RESTful APIs! The authentication section was particularly useful for my current project.',
        isApproved: true,
    },
    {
        content: 'Looking forward to the Docker guide! Will it cover Kubernetes deployment as well?',
        isApproved: false,
    },
];

async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
}

async function seedDatabase() {
    try {
        console.log('🌱 Starting database seeding...');

        // Clear existing data (optional - comment out if you want to keep existing data)
        console.log('🗑️  Clearing existing data...');
        await db.delete(refreshTokens);
        await db.delete(comments);
        await db.delete(postCategories);
        await db.delete(posts);
        await db.delete(categories);
        await db.delete(users);

        // Seed users
        console.log('👥 Seeding users...');
        const hashedUsers = await Promise.all(
            sampleUsers.map(async (user) => ({
                ...user,
                password: await hashPassword(user.password),
            }))
        );

        const insertedUsers = await db.insert(users).values(hashedUsers).returning();
        console.log(`✅ Created ${insertedUsers.length} users`);

        // Seed categories
        console.log('📂 Seeding categories...');
        const insertedCategories = await db.insert(categories).values(sampleCategories).returning();
        console.log(`✅ Created ${insertedCategories.length} categories`);

        // Seed posts
        console.log('📝 Seeding posts...');
        const postsWithAuthors = samplePosts.map((post, index) => ({
            ...post,
            authorId: insertedUsers[index % insertedUsers.length].id,
            publishedAt: post.isPublished ? new Date() : null,
        }));

        const insertedPosts = await db.insert(posts).values(postsWithAuthors).returning();
        console.log(`✅ Created ${insertedPosts.length} posts`);

        // Seed post categories (assign each post to 1-3 categories)
        console.log('🏷️  Seeding post categories...');
        const postCategoryRelations: { postId: number; categoryId: number }[] = [];
        for (let i = 0; i < insertedPosts.length; i++) {
            const numCategories = Math.floor(Math.random() * 3) + 1; // 1-3 categories per post
            const selectedCategories = insertedCategories
                .sort(() => 0.5 - Math.random())
                .slice(0, numCategories);

            for (const category of selectedCategories) {
                postCategoryRelations.push({
                    postId: insertedPosts[i].id,
                    categoryId: category.id,
                });
            }
        }

        await db.insert(postCategories).values(postCategoryRelations);
        console.log(`✅ Created ${postCategoryRelations.length} post-category relations`);

        // Seed comments
        console.log('💬 Seeding comments...');
        const commentsWithRelations = sampleComments.map((comment, index) => ({
            ...comment,
            postId: insertedPosts[index % insertedPosts.length].id,
            authorId: insertedUsers[index % insertedUsers.length].id,
        }));

        const insertedComments = await db.insert(comments).values(commentsWithRelations).returning();
        console.log(`✅ Created ${insertedComments.length} comments`);

        // Seed some nested comments (replies)
        console.log('🔄 Seeding comment replies...');
        const replies = [
            {
                content: 'Thanks for the feedback! I\'m glad the guide was helpful.',
                isApproved: true,
                parentId: insertedComments[0].id,
                postId: insertedComments[0].postId,
                authorId: insertedUsers[0].id, // Admin user
            },
            {
                content: 'I\'ll add a section on connection pooling in the next update.',
                isApproved: true,
                parentId: insertedComments[2].id,
                postId: insertedComments[2].postId,
                authorId: insertedUsers[0].id, // Admin user
            },
        ];

        await db.insert(comments).values(replies);
        console.log(`✅ Created ${replies.length} comment replies`);

        // Seed refresh tokens (for admin user)
        console.log('🔐 Seeding refresh tokens...');
        const adminUser = insertedUsers.find(user => user.role === 'admin');
        if (adminUser) {
            const refreshTokenData = {
                token: 'sample-refresh-token-' + Math.random().toString(36).substring(7),
                userId: adminUser.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                isRevoked: false,
            };

            await db.insert(refreshTokens).values(refreshTokenData);
            console.log('✅ Created refresh token for admin user');
        }

        console.log('🎉 Database seeding completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`- Users: ${insertedUsers.length}`);
        console.log(`- Categories: ${insertedCategories.length}`);
        console.log(`- Posts: ${insertedPosts.length}`);
        console.log(`- Comments: ${insertedComments.length + replies.length}`);
        console.log(`- Post-Category Relations: ${postCategoryRelations.length}`);
        console.log(`- Refresh Tokens: 1`);

        console.log('\n🔑 Test Credentials:');
        console.log('Admin: admin@example.com / admin123');
        console.log('User: john.doe@example.com / password123');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        throw error;
    }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
    seedDatabase()
        .then(() => {
            console.log('✅ Seeding completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Seeding failed:', error);
            process.exit(1);
        });
}

export { seedDatabase }; 