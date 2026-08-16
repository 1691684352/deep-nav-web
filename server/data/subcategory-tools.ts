import type { Tool } from '#shared/types'
import { categoryByName, navCategoryByName } from './taxonomy'

interface RawSubTool {
  slug: string
  name: string
  desc: string
  domain: string
  url: string
  tags: string[]
  heat?: string
}

/** Filter chips rendered above a subcategory listing. */
export const subcategoryFilters = ['全部', '热门推荐', '最新收录']

const rawImageTools: RawSubTool[] = [
  { slug: 'midjourney', name: 'Midjourney', desc: '高质量 AI 图像生成工具', domain: 'midjourney.com', url: 'https://www.midjourney.com', tags: ['热门推荐', '会员专享', '在线工具'], heat: '65.7k' },
  { slug: 'jimeng', name: '即梦 AI', desc: '中文创意图片与视频生成', domain: 'jimeng.jianying.com', url: 'https://jimeng.jianying.com', tags: ['热门推荐', '免费使用', '在线工具'], heat: '63.9k' },
  { slug: 'xfyun-huijing', name: '讯飞绘镜', desc: '描述即创作，轻松生成图片', domain: 'xfyun.cn', url: 'https://www.xfyun.cn', tags: ['免费使用', '在线工具'], heat: '88.9k' },
  { slug: 'dall-e', name: 'DALL-E', desc: 'OpenAI 图像生成工具', domain: 'openai.com', url: 'https://openai.com/dall-e-3', tags: ['热门推荐', '会员专享', '在线工具'], heat: '58.2k' },
  { slug: 'stable-diffusion', name: 'Stable Diffusion', desc: '开源 AI 图像生成模型', domain: 'stability.ai', url: 'https://stability.ai', tags: ['免费使用', '在线工具'], heat: '54.6k' },
  { slug: 'leonardo-ai', name: 'Leonardo AI', desc: '面向创作的 AI 图像平台', domain: 'leonardo.ai', url: 'https://leonardo.ai', tags: ['热门推荐', '免费使用', '在线工具'], heat: '48.3k' },
  { slug: 'ideogram', name: 'Ideogram', desc: '擅长文字排版的图像生成', domain: 'ideogram.ai', url: 'https://ideogram.ai', tags: ['热门推荐', '在线工具'], heat: '45.1k' },
  { slug: 'freepik-ai', name: 'Freepik AI', desc: '设计素材与 AI 图像创作', domain: 'freepik.com', url: 'https://www.freepik.com/ai', tags: ['免费使用', '在线工具'], heat: '42.7k' },
  { slug: 'krea-ai', name: 'Krea AI', desc: '实时 AI 图像与设计创作', domain: 'krea.ai', url: 'https://www.krea.ai', tags: ['最新收录', '免费使用', '在线工具'], heat: '40.9k' },
  { slug: 'seaart', name: 'SeaArt', desc: '在线 AI 绘画与模型社区', domain: 'seaart.ai', url: 'https://www.seaart.ai', tags: ['免费使用', '在线工具', '移动应用'], heat: '38.4k' },
  { slug: 'pixai', name: 'PixAI', desc: '动漫风格 AI 图像创作', domain: 'pixai.art', url: 'https://pixai.art', tags: ['免费使用', '在线工具', '移动应用'], heat: '36.2k' },
  { slug: 'liblibai', name: 'LiblibAI', desc: 'AI 绘画模型与创作平台', domain: 'liblib.art', url: 'https://www.liblib.art', tags: ['热门推荐', '免费使用', '在线工具'], heat: '35.8k' },
  { slug: 'adobe-firefly', name: 'Adobe Firefly', desc: 'Adobe 商用 AI 图像生成', domain: 'firefly.adobe.com', url: 'https://firefly.adobe.com', tags: ['会员专享', '在线工具'], heat: '34.5k' },
  { slug: 'playground-ai', name: 'Playground AI', desc: '快速生成和编辑 AI 图片', domain: 'playground.com', url: 'https://playground.com', tags: ['免费使用', '在线工具'], heat: '33.1k' },
  { slug: 'recraft', name: 'Recraft', desc: '生成矢量图与品牌视觉', domain: 'recraft.ai', url: 'https://www.recraft.ai', tags: ['最新收录', '免费使用', '在线工具'], heat: '32.4k' },
  { slug: 'canva-ai', name: 'Canva AI', desc: '在线设计与创意内容平台', domain: 'canva.com', url: 'https://www.canva.com', tags: ['热门推荐', '免费使用', '在线工具', '移动应用'], heat: '61.3k' },
  { slug: 'flux', name: 'FLUX', desc: '高质量开源图像生成模型', domain: 'blackforestlabs.ai', url: 'https://blackforestlabs.ai', tags: ['最新收录', '免费使用'], heat: '31.7k' },
  { slug: 'dreamina', name: 'Dreamina', desc: '字节旗下 AI 创作平台', domain: 'dreamina.jianying.com', url: 'https://dreamina.jianying.com', tags: ['最新收录', '免费使用', '在线工具', '移动应用'], heat: '30.8k' },
  { slug: 'civitai', name: 'Civitai', desc: 'AI 图像模型与社区平台', domain: 'civitai.com', url: 'https://civitai.com', tags: ['免费使用', '在线工具'], heat: '29.6k' },
  { slug: 'fotor', name: 'Fotor', desc: '在线 AI 图片编辑工具', domain: 'fotor.com', url: 'https://www.fotor.com', tags: ['免费使用', '在线工具', '移动应用'], heat: '28.9k' },
  { slug: 'nightcafe', name: 'NightCafe', desc: '多模型 AI 艺术创作社区', domain: 'nightcafe.studio', url: 'https://nightcafe.studio', tags: ['免费使用', '在线工具'], heat: '27.5k' },
  { slug: 'mage-space', name: 'Mage Space', desc: '快速生成高质量 AI 图像', domain: 'mage.space', url: 'https://www.mage.space', tags: ['免费使用', '在线工具'], heat: '26.3k' },
  { slug: 'clipdrop', name: 'Clipdrop', desc: 'AI 图像生成与编辑套件', domain: 'clipdrop.co', url: 'https://clipdrop.co', tags: ['热门推荐', '在线工具'], heat: '25.8k' },
  { slug: 'photoroom', name: 'PhotoRoom', desc: '商品图与背景处理工具', domain: 'photoroom.com', url: 'https://www.photoroom.com', tags: ['免费使用', '在线工具', '移动应用'], heat: '24.7k' },
  { slug: 'remove-bg-image', name: 'Remove.bg', desc: '自动移除图片背景', domain: 'remove.bg', url: 'https://www.remove.bg', tags: ['热门推荐', '在线工具'], heat: '42.5k' },
  { slug: 'artbreeder', name: 'Artbreeder', desc: '基于模型混合的图像创作', domain: 'artbreeder.com', url: 'https://www.artbreeder.com', tags: ['免费使用', '在线工具'], heat: '22.4k' },
  { slug: 'deep-dream-generator', name: 'Deep Dream Generator', desc: '艺术风格图像生成平台', domain: 'deepdreamgenerator.com', url: 'https://deepdreamgenerator.com', tags: ['最新收录', '在线工具'], heat: '21.6k' },
  { slug: 'prisma', name: 'Prisma', desc: '移动端 AI 艺术滤镜工具', domain: 'prisma-ai.com', url: 'https://prisma-ai.com', tags: ['免费使用', '移动应用'], heat: '20.9k' },
  { slug: 'picsart-ai', name: 'Picsart AI', desc: '面向创作的 AI 图片编辑器', domain: 'picsart.com', url: 'https://picsart.com', tags: ['热门推荐', '免费使用', '在线工具', '移动应用'], heat: '20.2k' },
  { slug: 'vanceai', name: 'VanceAI', desc: 'AI 图片增强与修复工具', domain: 'vanceai.com', url: 'https://vanceai.com', tags: ['最新收录', '在线工具'], heat: '19.5k' },
  { slug: 'google-imagefx', name: 'Google ImageFX', desc: 'Google 实验性 AI 图像生成工具', domain: 'labs.google', url: 'https://labs.google/fx/tools/image-fx', tags: ['热门推荐', '最新收录', '在线工具'], heat: '19.1k' },
  { slug: 'microsoft-designer', name: 'Microsoft Designer', desc: '微软 AI 图像与社媒设计工具', domain: 'designer.microsoft.com', url: 'https://designer.microsoft.com', tags: ['热门推荐', '免费使用', '在线工具'], heat: '18.6k' },
  { slug: 'openart', name: 'OpenArt', desc: '集生成、编辑和工作流于一体的 AI 画图平台', domain: 'openart.ai', url: 'https://openart.ai', tags: ['免费使用', '在线工具'], heat: '18.2k' },
  { slug: 'tensor-art', name: 'Tensor.Art', desc: 'AI 绘画模型与在线生成社区', domain: 'tensor.art', url: 'https://tensor.art', tags: ['免费使用', '在线工具'], heat: '17.8k' },
  { slug: 'shakker-ai', name: 'Shakker AI', desc: '面向设计创作的 AI 图像平台', domain: 'shakker.ai', url: 'https://www.shakker.ai', tags: ['最新收录', '免费使用', '在线工具'], heat: '17.3k' },
  { slug: 'invoke-ai', name: 'Invoke AI', desc: '专业级 AI 图像生成与工作流工具', domain: 'invoke.ai', url: 'https://invoke.ai', tags: ['最新收录', '在线工具'], heat: '16.9k' },
  { slug: 'comfyui', name: 'ComfyUI', desc: '节点式 Stable Diffusion 工作流界面', domain: 'github.com', url: 'https://github.com/comfyanonymous/ComfyUI', tags: ['免费使用', '在线工具'], heat: '16.4k' },
  { slug: 'fooocus', name: 'Fooocus', desc: '易上手的开源 AI 图像生成工具', domain: 'github.com', url: 'https://github.com/lllyasviel/Fooocus', tags: ['免费使用', '在线工具'], heat: '15.8k' },
  { slug: 'picwish', name: 'PicWish', desc: 'AI 抠图、修图与商品图处理工具', domain: 'picwish.com', url: 'https://picwish.com', tags: ['免费使用', '在线工具', '移动应用'], heat: '15.2k' },
  { slug: 'cutout-pro', name: 'Cutout.Pro', desc: 'AI 图片与视频视觉处理平台', domain: 'cutout.pro', url: 'https://www.cutout.pro', tags: ['免费使用', '在线工具'], heat: '14.7k' },
  { slug: 'upscayl', name: 'Upscayl', desc: '开源 AI 图片无损放大工具', domain: 'upscayl.org', url: 'https://upscayl.org', tags: ['免费使用', '在线工具'], heat: '14.1k' },
  { slug: 'lets-enhance', name: "Let's Enhance", desc: 'AI 图片增强与分辨率提升工具', domain: 'letsenhance.io', url: 'https://letsenhance.io', tags: ['热门推荐', '在线工具'], heat: '13.6k' },
  { slug: 'topaz-photo-ai', name: 'Topaz Photo AI', desc: '专业级 AI 图片降噪与锐化工具', domain: 'topazlabs.com', url: 'https://www.topazlabs.com/topaz-photo-ai', tags: ['会员专享', '在线工具'], heat: '13.2k' },
  { slug: 'wombo-dream', name: 'WOMBO Dream', desc: '移动端 AI 艺术图像创作应用', domain: 'wombo.ai', url: 'https://www.wombo.ai', tags: ['免费使用', '移动应用'], heat: '12.8k' },
  { slug: 'starryai', name: 'starryai', desc: '多风格 AI 艺术图像生成工具', domain: 'starryai.com', url: 'https://starryai.com', tags: ['免费使用', '在线工具', '移动应用'], heat: '12.3k' },
]

function toTool(raw: RawSubTool, index: number, categoryName: string, navCategoryName: string): Tool {
  const heat = raw.heat ?? '10.0k'
  return {
    id: `sub-${navCategoryByName.get(navCategoryName)?.slug ?? 'x'}-${String(index + 1).padStart(3, '0')}`,
    slug: raw.slug,
    name: raw.name,
    desc: raw.desc,
    category: categoryName,
    categorySlug: categoryByName.get(categoryName)?.slug ?? 'all',
    navCategory: navCategoryName,
    navCategorySlug: navCategoryByName.get(navCategoryName)?.slug ?? 'hot',
    domain: raw.domain,
    url: raw.url,
    heat,
    heatValue: Math.round((Number.parseFloat(heat) || 0) * 1000),
    verified: raw.tags.includes('热门推荐'),
    tags: raw.tags,
    createdAt: '2026-01-01',
  }
}

/** Deep catalogs used by the subcategory listing page. */
export const subcategoryCatalog: Record<string, Tool[]> = {
  'ai-image': rawImageTools.map((raw, index) => toTool(raw, index, '设计创意', 'AI图像')),
}
