import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    category: z.enum([
      'Skiing',
      'Food & Drink',
      'Travel',
      'News',
      'Gear',
      'Culture',
      'Adventure',
      'Training',
      'Research'
    ]),
    date: z.coerce.date(),
    author: z.string().default('KG Reporter'),
    image: z.string(),
    imageCredit: z.string().optional(),
    draft: z.boolean().default(false),
  })
});

export const collections = {
  blog: blogCollection,
};
