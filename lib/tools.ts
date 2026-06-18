/**
 * B2B Customer Intelligence - Tools
 * 
 * 包含网页抓取和网络搜索工具，用于收集客户信息
 */

import * as cheerio from 'cheerio';

const MAX_CONTENT_LENGTH = 5000;

/**
 * 抓取指定URL的网页内容
 */
export async function fetchWebsite(url: string): Promise<string> {
  try {
    // 确保URL有协议前缀
    let targetUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      targetUrl = `https://${url}`;
    }

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      return `Error: HTTP ${response.status} - Failed to fetch ${targetUrl}`;
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // 移除不需要的元素
    $('script, style, nav, footer, iframe, noscript, svg, img, video, audio, canvas, [class*="cookie"], [class*="modal"], [class*="popup"]').remove();

    // 提取文本内容，优先从主要内容区域
    let content = '';

    // 尝试提取标题
    const title = $('title').text().trim() || $('h1').first().text().trim();
    if (title) {
      content += `Title: ${title}\n\n`;
    }

    // 尝试提取meta description
    const metaDesc = $('meta[name="description"]').attr('content');
    if (metaDesc) {
      content += `Meta Description: ${metaDesc}\n\n`;
    }

    // 提取主要内容的策略：优先从常见的内容容器中提取
    const contentSelectors = [
      'main',
      'article',
      '[role="main"]',
      '.content',
      '.main-content',
      '.page-content',
      '#content',
      '#main',
      '.container',
      'body',
    ];

    for (const selector of contentSelectors) {
      const element = $(selector).first();
      if (element.length > 0) {
        const text = element.text()
          .replace(/\s+/g, ' ')
          .replace(/\n\s*\n/g, '\n')
          .trim();
        if (text.length > content.length) {
          content += text;
        }
        break;
      }
    }

    // 如果没有从选择器获取到内容，使用body
    if (!content || content.length < 100) {
      const bodyText = $('body').text()
        .replace(/\s+/g, ' ')
        .replace(/\n\s*\n/g, '\n')
        .trim();
      content += bodyText;
    }

    // 截断内容
    if (content.length > MAX_CONTENT_LENGTH) {
      content = content.substring(0, MAX_CONTENT_LENGTH) + '\n\n[Content truncated...]';
    }

    return content;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return `Error fetching ${url}: ${errorMessage}`;
  }
}

/**
 * 使用Tavily API搜索网络信息
 */
export async function searchWeb(query: string, maxResults: number = 5): Promise<string> {
  try {
    const apiKey = process.env.TAVILY_API_KEY;
    if (!apiKey) {
      return 'Error: TAVILY_API_KEY not configured';
    }

    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        query: query,
        search_depth: 'advanced',
        max_results: maxResults,
        include_answer: true,
        include_raw_content: false,
      }),
      signal: AbortSignal.timeout(20000),
    });

    if (!response.ok) {
      return `Error: Tavily API returned ${response.status}`;
    }

    const data = await response.json();

    let result = '';

    // Tavily的AI总结
    if (data.answer) {
      result += `AI Summary: ${data.answer}\n\n`;
    }

    // 搜索结果
    if (data.results && data.results.length > 0) {
      result += 'Search Results:\n\n';
      for (let i = 0; i < data.results.length; i++) {
        const item = data.results[i];
        result += `[${i + 1}] Title: ${item.title || 'N/A'}\n`;
        result += `    URL: ${item.url || 'N/A'}\n`;
        result += `    Content: ${item.content || 'N/A'}\n\n`;
      }
    }

    if (!result) {
      return 'No results found for this query.';
    }

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return `Error searching web: ${errorMessage}`;
  }
}

/**
 * 批量搜索多个查询，返回合并结果
 */
export async function batchSearch(queries: string[]): Promise<Record<string, string>> {
  const results: Record<string, string> = {};

  // 串行执行搜索，避免并发限制
  for (const query of queries) {
    try {
      results[query] = await searchWeb(query, 3);
      // 添加小延迟，避免API限制
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      results[query] = `Error: ${error instanceof Error ? error.message : String(error)}`;
    }
  }

  return results;
}

/**
 * 尝试抓取多个相关页面
 */
export async function fetchMultiplePages(baseUrl: string, paths: string[]): Promise<Record<string, string>> {
  const results: Record<string, string> = {};

  let normalizedBase = baseUrl;
  if (!normalizedBase.startsWith('http://') && !normalizedBase.startsWith('https://')) {
    normalizedBase = `https://${normalizedBase}`;
  }
  normalizedBase = normalizedBase.replace(/\/$/, '');

  for (const path of paths) {
    const url = `${normalizedBase}${path}`;
    try {
      results[path] = await fetchWebsite(url);
    } catch (error) {
      results[path] = `Error: ${error instanceof Error ? error.message : String(error)}`;
    }
  }

  return results;
}
