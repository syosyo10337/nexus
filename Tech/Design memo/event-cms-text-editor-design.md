# Event CMS Custom Text Editor Design

## System Overview

```
+------------------+     +------------------+     +------------------+
|                  |     |                  |     |                  |
|   Event CMS      |---->|   Renderer       |---->|   Outputs        |
|   (Editor)       |     |   Engine         |     |                  |
|                  |     |                  |     |   - Website HTML |
+------------------+     +------------------+     |   - Instagram    |
                                                  |   - Preview      |
                                                  +------------------+
```

---

## 1. Data Model

### Event Schema

```typescript
interface Event {
  id: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';

  // Basic Info
  title: string;
  subtitle?: string;
  eventType: EventType;
  template: TemplateType;

  // Date & Time
  schedule: {
    date: Date;
    doorOpen?: string;      // "19:00"
    startTime: string;      // "19:30"
    endTime?: string;       // "22:00"
    duration?: number;      // minutes
  };

  // Location
  venue: Venue;

  // Pricing
  pricing: Pricing[];

  // Content Blocks (Rich Text)
  blocks: ContentBlock[];

  // Performers
  performers: Performer[];

  // Booking
  reservation: ReservationInfo;

  // Media
  images: Image[];

  // Credits
  credits: Credit[];

  // Social
  hashtags: string[];
  mentions: string[];       // @usernames

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  instagramPostId?: string;
}

type EventType =
  | 'open_mic'
  | 'concert'
  | 'workshop'
  | 'screening'
  | 'collaboration'
  | 'talk'
  | 'exhibition'
  | 'party'
  | 'report';

type TemplateType =
  | 'soy_poy_standard'    // ■ style
  | 'collaboration'       // 【】style
  | 'concert'            // Detailed format
  | 'workshop'           // ⭐️ style
  | 'minimal'            // Simple format
  | 'report'             // Event report
  | 'custom';

interface Venue {
  id: string;
  name: string;
  nameEn?: string;
  address: string;
  postalCode?: string;
  instagramHandle?: string;
  googleMapsUrl?: string;
  access?: string;        // "下北沢駅・東口から徒歩1分"
}

interface Pricing {
  label: string;          // "一般", "学生", "参加費"
  amount: number;
  note?: string;          // "ドリンク1杯付き"
  currency: 'JPY';
}

interface Performer {
  name: string;
  role?: string;          // "ピアノ", "監督"
  bio?: string;
  instagramHandle?: string;
  order: number;
}

interface ReservationInfo {
  required: boolean;
  formUrl?: string;
  email?: string;
  phone?: string;
  note?: string;          // "当日現金払い"
  deadline?: Date;
  capacity?: number;
}

interface Credit {
  role: string;           // "Designed by", "Photographed by"
  name: string;
  instagramHandle?: string;
}

interface Image {
  id: string;
  url: string;
  alt?: string;
  type: 'main' | 'gallery' | 'flyer';
  order: number;
}
```

### Content Block System

```typescript
type ContentBlock =
  | HeadingBlock
  | ParagraphBlock
  | ListBlock
  | DividerBlock
  | QuoteBlock
  | PerformerListBlock
  | PricingTableBlock
  | ScheduleBlock
  | LocationBlock
  | ReservationBlock
  | CustomBlock;

interface BaseBlock {
  id: string;
  order: number;
}

interface HeadingBlock extends BaseBlock {
  type: 'heading';
  style: HeadingStyle;
  text: string;
  level: 1 | 2 | 3;
}

type HeadingStyle =
  | 'square'      // ■ 見出し
  | 'bracket'     // 【見出し】
  | 'star'        // ⭐️見出し⭐️
  | 'triangle'    // ▷見出し
  | 'diamond'     // ⟡見出し⟡
  | 'circle'      // ◎見出し
  | 'plain';      // 見出し

interface ParagraphBlock extends BaseBlock {
  type: 'paragraph';
  text: string;
  // Inline formatting stored as ranges
  formatting?: InlineFormat[];
}

interface InlineFormat {
  start: number;
  end: number;
  type: 'mention' | 'hashtag' | 'link' | 'bold';
  value?: string;
}

interface ListBlock extends BaseBlock {
  type: 'list';
  style: ListStyle;
  items: string[];
}

type ListStyle =
  | 'dot'         // ・
  | 'circle'      // ○
  | 'numbered'    // ① ② ③
  | 'numbered_dot'// 1. 2. 3.
  | 'dash';       // -

interface DividerBlock extends BaseBlock {
  type: 'divider';
  style: DividerStyle;
}

type DividerStyle =
  | 'short'       // ———
  | 'long'        // ————————————
  | 'dashed'      // - - - - - -
  | 'line';       // ⸻

interface QuoteBlock extends BaseBlock {
  type: 'quote';
  text: string;
  author?: string;
}

// Pre-built component blocks
interface ScheduleBlock extends BaseBlock {
  type: 'schedule';
  // Uses event.schedule data
}

interface LocationBlock extends BaseBlock {
  type: 'location';
  showAddress: boolean;
  showAccess: boolean;
  showEmoji: boolean;  // 📍
}

interface PricingTableBlock extends BaseBlock {
  type: 'pricing';
  // Uses event.pricing data
}

interface PerformerListBlock extends BaseBlock {
  type: 'performers';
  showBio: boolean;
  showInstagram: boolean;
}

interface ReservationBlock extends BaseBlock {
  type: 'reservation';
  showEmoji: boolean;  // 👉
}

interface CustomBlock extends BaseBlock {
  type: 'custom';
  content: string;  // Raw text with formatting
}
```

---

## 2. Editor UI Design

### Layout

```
+------------------------------------------------------------------+
|  [Save Draft]  [Preview ▼]  [Publish ▼]           @soy.poy_      |
+------------------------------------------------------------------+
|                                                                   |
|  +------------------+  +--------------------------------------+   |
|  |                  |  |                                      |   |
|  |  Event Info      |  |  Content Editor                     |   |
|  |  (Sidebar)       |  |                                      |   |
|  |                  |  |  +--------------------------------+  |   |
|  |  Template: [▼]   |  |  |  Block Toolbar                 |  |   |
|  |                  |  |  |  [■] [【】] [⭐] [—] [・] [+]  |  |   |
|  |  Event Type: [▼] |  |  +--------------------------------+  |   |
|  |                  |  |                                      |   |
|  |  ─────────────   |  |  +--------------------------------+  |   |
|  |                  |  |  |                                |  |   |
|  |  📅 Date         |  |  |  ■ 日時                        |  |   |
|  |  [2025-01-24]    |  |  |  2025年1月24日（土）           |  |   |
|  |                  |  |  |  受付開始｜19:00              |  |   |
|  |  🕐 Time         |  |  |  イベント開始｜19:30          |  |   |
|  |  Open [19:00]    |  |  |                                |  |   |
|  |  Start [19:30]   |  |  |  ■ 参加費                      |  |   |
|  |                  |  |  |  1,000円（ドリンク1杯付き🍹）  |  |   |
|  |  ─────────────   |  |  |                                |  |   |
|  |                  |  |  |  ■ 内容                        |  |   |
|  |  💰 Pricing      |  |  |  [                          ]  |  |   |
|  |  [+ Add Price]   |  |  |                                |  |   |
|  |                  |  |  +--------------------------------+  |   |
|  |  ─────────────   |  |                                      |   |
|  |                  |  +--------------------------------------+   |
|  |  📍 Venue        |                                            |
|  |  [SOY-POY    ▼]  |  +--------------------------------------+   |
|  |                  |  |  Preview Panel                       |   |
|  |  ─────────────   |  |  [Website] [Instagram] [Plain Text]  |   |
|  |                  |  |  +--------------------------------+  |   |
|  |  👥 Performers   |  |  |                                |  |   |
|  |  [+ Add]         |  |  |  Instagram Preview             |  |   |
|  |                  |  |  |  (Mobile frame mockup)         |  |   |
|  |  ─────────────   |  |  |                                |  |   |
|  |                  |  |  +--------------------------------+  |   |
|  |  📝 Credits      |  +--------------------------------------+   |
|  |  [+ Add]         |                                            |
|  |                  |                                            |
|  +------------------+                                            |
+------------------------------------------------------------------+
```

### Block Toolbar

```
+------------------------------------------------------------------+
|  Headings          Lists           Dividers        Components     |
|  ┌────────────┐   ┌────────────┐  ┌────────────┐  ┌────────────┐ |
|  │ ■  Square  │   │ ・ Dot     │  │ ─── Short  │  │ 📅 Schedule│ |
|  │【】Bracket │   │ ○  Circle  │  │ ──── Long  │  │ 💰 Pricing │ |
|  │ ⭐ Star    │   │ ①  Number  │  │ - - Dashed │  │ 📍 Location│ |
|  │ ▷  Triangle│   │ 1. Num Dot │  │ ⸻  Line   │  │ 👥 Perform │ |
|  │ ⟡  Diamond │   │ -  Dash    │  └────────────┘  │ 📝 Reserve │ |
|  │ ◎  Circle  │   └────────────┘                  └────────────┘ |
|  └────────────┘                                                   |
+------------------------------------------------------------------+
```

---

## 3. Rendering Engine

### Architecture

```typescript
// Output renderers
interface Renderer {
  render(event: Event): string;
}

class InstagramRenderer implements Renderer {
  render(event: Event): string {
    // Max 2,200 characters
    // Plain text with emoji/symbols
    // @mentions and #hashtags
  }
}

class WebsiteRenderer implements Renderer {
  render(event: Event): string {
    // HTML output
    // Rich formatting
    // Links, images
  }
}

class PlainTextRenderer implements Renderer {
  render(event: Event): string {
    // Copy-paste friendly
    // No special formatting
  }
}
```

### Instagram Renderer Implementation

```typescript
class InstagramRenderer implements Renderer {
  private symbolMap: Record<HeadingStyle, (text: string) => string> = {
    square: (text) => `■ ${text}`,
    bracket: (text) => `【${text}】`,
    star: (text) => `⭐️${text}⭐️`,
    triangle: (text) => `▷${text}`,
    diamond: (text) => `⟡${text}⟡`,
    circle: (text) => `◎${text}`,
    plain: (text) => text,
  };

  private listStyleMap: Record<ListStyle, (index: number) => string> = {
    dot: () => '・',
    circle: () => '○',
    numbered: (i) => ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'][i] || `${i + 1}.`,
    numbered_dot: (i) => `${i + 1}. `,
    dash: () => '-',
  };

  private dividerMap: Record<DividerStyle, string> = {
    short: '———',
    long: '————————————',
    dashed: '- - - - - - - - - -',
    line: '⸻',
  };

  render(event: Event): string {
    const parts: string[] = [];

    for (const block of event.blocks) {
      parts.push(this.renderBlock(block, event));
    }

    // Add hashtags
    if (event.hashtags.length > 0) {
      parts.push(event.hashtags.map(tag => `#${tag}`).join(' '));
    }

    const result = parts.join('\n\n');

    // Instagram limit check
    if (result.length > 2200) {
      console.warn(`Content exceeds Instagram limit: ${result.length}/2200`);
    }

    return result;
  }

  private renderBlock(block: ContentBlock, event: Event): string {
    switch (block.type) {
      case 'heading':
        return this.symbolMap[block.style](block.text);

      case 'paragraph':
        return this.renderParagraph(block);

      case 'list':
        return block.items
          .map((item, i) => `${this.listStyleMap[block.style](i)}${item}`)
          .join('\n');

      case 'divider':
        return this.dividerMap[block.style];

      case 'schedule':
        return this.renderSchedule(event.schedule);

      case 'location':
        return this.renderLocation(event.venue, block);

      case 'pricing':
        return this.renderPricing(event.pricing);

      case 'performers':
        return this.renderPerformers(event.performers, block);

      case 'reservation':
        return this.renderReservation(event.reservation, block);

      default:
        return '';
    }
  }

  private renderSchedule(schedule: Event['schedule']): string {
    const date = new Date(schedule.date);
    const weekday = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];

    const lines = [
      `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日（${weekday}）`,
    ];

    if (schedule.doorOpen) {
      lines.push(`受付開始｜${schedule.doorOpen}`);
    }
    lines.push(`イベント開始｜${schedule.startTime}`);

    return lines.join('\n');
  }

  private renderLocation(venue: Venue, block: LocationBlock): string {
    const parts: string[] = [];

    if (block.showEmoji) {
      parts.push('📍');
    }

    parts.push(venue.name);

    if (venue.instagramHandle) {
      parts.push(`@${venue.instagramHandle}`);
    }

    if (block.showAddress) {
      parts.push(`\n${venue.address}`);
    }

    if (block.showAccess && venue.access) {
      parts.push(`\n${venue.access}`);
    }

    return parts.join(' ');
  }

  private renderPricing(pricing: Pricing[]): string {
    return pricing.map(p => {
      let line = `${p.label}：¥${p.amount.toLocaleString()}`;
      if (p.note) {
        line += `（${p.note}）`;
      }
      return line;
    }).join('\n');
  }

  private renderPerformers(performers: Performer[], block: PerformerListBlock): string {
    return performers.map(p => {
      let line = p.name;
      if (p.role) {
        line += `（${p.role}）`;
      }
      if (block.showInstagram && p.instagramHandle) {
        line += ` @${p.instagramHandle}`;
      }
      return line;
    }).join('\n');
  }

  private renderReservation(reservation: ReservationInfo, block: ReservationBlock): string {
    const parts: string[] = [];

    if (block.showEmoji) {
      parts.push('👉');
    }

    if (reservation.formUrl) {
      parts.push(reservation.formUrl);
    }

    if (reservation.note) {
      parts.push(`\n※${reservation.note}`);
    }

    return parts.join('');
  }

  private renderParagraph(block: ParagraphBlock): string {
    let text = block.text;

    // Apply inline formatting (mentions, hashtags)
    if (block.formatting) {
      // Sort by position descending to avoid offset issues
      const sorted = [...block.formatting].sort((a, b) => b.start - a.start);

      for (const fmt of sorted) {
        if (fmt.type === 'mention' && fmt.value) {
          text = text.slice(0, fmt.start) + `@${fmt.value}` + text.slice(fmt.end);
        }
      }
    }

    return text;
  }
}
```

### Website Renderer (HTML)

```typescript
class WebsiteRenderer implements Renderer {
  render(event: Event): string {
    return `
      <article class="event-post" data-type="${event.eventType}">
        <header class="event-header">
          <h1>${this.escapeHtml(event.title)}</h1>
          ${event.subtitle ? `<p class="subtitle">${this.escapeHtml(event.subtitle)}</p>` : ''}
        </header>

        <div class="event-content">
          ${event.blocks.map(block => this.renderBlock(block, event)).join('\n')}
        </div>

        <footer class="event-footer">
          <div class="hashtags">
            ${event.hashtags.map(tag => `<a href="/tag/${tag}">#${tag}</a>`).join(' ')}
          </div>
        </footer>
      </article>
    `;
  }

  private renderBlock(block: ContentBlock, event: Event): string {
    switch (block.type) {
      case 'heading':
        return `<h${block.level + 1} class="heading heading--${block.style}">
          ${this.getHeadingPrefix(block.style)}${this.escapeHtml(block.text)}
        </h${block.level + 1}>`;

      case 'paragraph':
        return `<p>${this.renderRichText(block.text, block.formatting)}</p>`;

      case 'list':
        const tag = block.style === 'numbered' || block.style === 'numbered_dot' ? 'ol' : 'ul';
        return `<${tag} class="list list--${block.style}">
          ${block.items.map(item => `<li>${this.escapeHtml(item)}</li>`).join('\n')}
        </${tag}>`;

      case 'divider':
        return `<hr class="divider divider--${block.style}" />`;

      case 'schedule':
        return this.renderScheduleHtml(event.schedule);

      case 'location':
        return this.renderLocationHtml(event.venue, block);

      case 'pricing':
        return this.renderPricingHtml(event.pricing);

      default:
        return '';
    }
  }

  private renderScheduleHtml(schedule: Event['schedule']): string {
    const date = new Date(schedule.date);
    return `
      <div class="schedule-block">
        <time datetime="${date.toISOString()}">
          ${this.formatDate(date)}
        </time>
        <dl class="schedule-times">
          ${schedule.doorOpen ? `<dt>受付開始</dt><dd>${schedule.doorOpen}</dd>` : ''}
          <dt>イベント開始</dt><dd>${schedule.startTime}</dd>
        </dl>
      </div>
    `;
  }

  private renderLocationHtml(venue: Venue, block: LocationBlock): string {
    return `
      <div class="location-block">
        <h3 class="location-name">
          ${block.showEmoji ? '<span class="emoji">📍</span>' : ''}
          ${venue.instagramHandle
            ? `<a href="https://instagram.com/${venue.instagramHandle}">${this.escapeHtml(venue.name)}</a>`
            : this.escapeHtml(venue.name)}
        </h3>
        ${block.showAddress ? `<address>${this.escapeHtml(venue.address)}</address>` : ''}
        ${block.showAccess && venue.access ? `<p class="access">${this.escapeHtml(venue.access)}</p>` : ''}
        ${venue.googleMapsUrl ? `<a href="${venue.googleMapsUrl}" class="map-link">Google Maps</a>` : ''}
      </div>
    `;
  }

  private renderPricingHtml(pricing: Pricing[]): string {
    return `
      <div class="pricing-block">
        <table class="pricing-table">
          <tbody>
            ${pricing.map(p => `
              <tr>
                <th>${this.escapeHtml(p.label)}</th>
                <td>¥${p.amount.toLocaleString()}${p.note ? `<small>（${this.escapeHtml(p.note)}）</small>` : ''}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // ... helper methods
}
```

---

## 4. Instagram API Integration

### Publishing Flow

```typescript
interface InstagramPublisher {
  publish(event: Event, images: File[]): Promise<PublishResult>;
  schedule(event: Event, images: File[], publishAt: Date): Promise<ScheduleResult>;
}

class InstagramGraphAPIPublisher implements InstagramPublisher {
  private accessToken: string;
  private instagramAccountId: string;

  async publish(event: Event, images: File[]): Promise<PublishResult> {
    const renderer = new InstagramRenderer();
    const caption = renderer.render(event);

    // 1. Upload media
    const mediaIds = await Promise.all(
      images.map(img => this.uploadMedia(img))
    );

    // 2. Create container (for carousel or single image)
    const containerId = mediaIds.length > 1
      ? await this.createCarousel(mediaIds, caption)
      : await this.createSinglePost(mediaIds[0], caption);

    // 3. Publish
    const result = await this.publishContainer(containerId);

    return {
      success: true,
      postId: result.id,
      permalink: result.permalink,
    };
  }

  private async uploadMedia(image: File): Promise<string> {
    // Upload to Instagram's content publishing API
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${this.instagramAccountId}/media`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: await this.uploadToTempStorage(image),
          is_carousel_item: true,
        }),
      }
    );

    const data = await response.json();
    return data.id;
  }

  private async createCarousel(mediaIds: string[], caption: string): Promise<string> {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${this.instagramAccountId}/media`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          media_type: 'CAROUSEL',
          children: mediaIds,
          caption: caption,
        }),
      }
    );

    const data = await response.json();
    return data.id;
  }

  private async publishContainer(containerId: string): Promise<any> {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${this.instagramAccountId}/media_publish`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          creation_id: containerId,
        }),
      }
    );

    return response.json();
  }
}
```

---

## 5. Template System

### Pre-built Templates

```typescript
const templates: Record<TemplateType, ContentBlock[]> = {
  soy_poy_standard: [
    { type: 'heading', style: 'square', text: '日時', level: 2 },
    { type: 'schedule' },
    { type: 'heading', style: 'square', text: '参加費', level: 2 },
    { type: 'pricing' },
    { type: 'heading', style: 'square', text: '内容', level: 2 },
    { type: 'paragraph', text: '' },
    { type: 'heading', style: 'square', text: 'オープンマイクとは？', level: 2 },
    { type: 'paragraph', text: '音楽、朗読、コント、ダンス、ポエトリー、スピーチなど。...' },
    { type: 'heading', style: 'bracket', text: '募集', level: 2 },
    { type: 'paragraph', text: '出展希望の方へ' },
    { type: 'list', style: 'dot', items: [] },
    { type: 'heading', style: 'square', text: '大切にしていること：3つのRespect', level: 2 },
    { type: 'list', style: 'numbered_dot', items: [
      'Space｜この空間への敬意',
      'Others｜ここにいる他者への敬意',
      'Yourself｜自分自身への敬意'
    ]},
    { type: 'location', showEmoji: true, showAddress: false, showAccess: false },
  ],

  collaboration: [
    { type: 'heading', style: 'bracket', text: '', level: 1 }, // Title
    { type: 'heading', style: 'triangle', text: 'ライブ情報', level: 2 },
    { type: 'heading', style: 'bracket', text: '日程', level: 3 },
    { type: 'schedule' },
    { type: 'heading', style: 'bracket', text: '場所', level: 3 },
    { type: 'location', showEmoji: false, showAddress: true, showAccess: false },
    { type: 'heading', style: 'bracket', text: '料金', level: 3 },
    { type: 'pricing' },
    { type: 'heading', style: 'circle', text: '出演者', level: 2 },
    { type: 'performers', showBio: false, showInstagram: true },
    { type: 'heading', style: 'bracket', text: '予約フォーム', level: 3 },
    { type: 'reservation', showEmoji: false },
  ],

  workshop: [
    { type: 'heading', style: 'star', text: '', level: 1 }, // Title
    { type: 'heading', style: 'bracket', text: '日時', level: 2 },
    { type: 'schedule' },
    { type: 'heading', style: 'bracket', text: '会場', level: 2 },
    { type: 'location', showEmoji: false, showAddress: true, showAccess: false },
    { type: 'heading', style: 'bracket', text: '参加費', level: 2 },
    { type: 'pricing' },
    { type: 'heading', style: 'bracket', text: '対象', level: 2 },
    { type: 'paragraph', text: '' },
    { type: 'heading', style: 'bracket', text: '内容', level: 2 },
    { type: 'list', style: 'dot', items: [] },
    { type: 'heading', style: 'bracket', text: '申し込み', level: 2 },
    { type: 'reservation', showEmoji: false },
    { type: 'heading', style: 'bracket', text: '主催', level: 2 },
    { type: 'paragraph', text: '' },
  ],

  // ... other templates
};
```

---

## 6. Character Counter & Validation

```typescript
interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

interface ValidationError {
  field: string;
  message: string;
}

interface ValidationWarning {
  field: string;
  message: string;
}

class InstagramValidator {
  private readonly CAPTION_LIMIT = 2200;
  private readonly HASHTAG_LIMIT = 30;
  private readonly MENTION_LIMIT = 20;

  validate(event: Event): ValidationResult {
    const renderer = new InstagramRenderer();
    const content = renderer.render(event);

    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // Character count
    if (content.length > this.CAPTION_LIMIT) {
      errors.push({
        field: 'content',
        message: `文字数が上限を超えています (${content.length}/${this.CAPTION_LIMIT})`,
      });
    } else if (content.length > this.CAPTION_LIMIT * 0.9) {
      warnings.push({
        field: 'content',
        message: `文字数が上限に近づいています (${content.length}/${this.CAPTION_LIMIT})`,
      });
    }

    // Hashtag count
    if (event.hashtags.length > this.HASHTAG_LIMIT) {
      errors.push({
        field: 'hashtags',
        message: `ハッシュタグが上限を超えています (${event.hashtags.length}/${this.HASHTAG_LIMIT})`,
      });
    }

    // Mention count
    const mentionCount = this.countMentions(content);
    if (mentionCount > this.MENTION_LIMIT) {
      errors.push({
        field: 'mentions',
        message: `メンションが上限を超えています (${mentionCount}/${this.MENTION_LIMIT})`,
      });
    }

    // Required fields
    if (!event.title) {
      errors.push({ field: 'title', message: 'タイトルは必須です' });
    }

    if (!event.schedule.date) {
      errors.push({ field: 'schedule.date', message: '日付は必須です' });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  private countMentions(content: string): number {
    const matches = content.match(/@[\w.]+/g);
    return matches ? matches.length : 0;
  }
}
```

---

## 7. Tech Stack Recommendation

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Editor**: TipTap or Slate.js (block-based editor)
- **UI**: Tailwind CSS + Radix UI
- **State**: Zustand or Jotai
- **Forms**: React Hook Form + Zod

### Backend
- **API**: Next.js API Routes or tRPC
- **Database**: PostgreSQL + Prisma
- **Auth**: NextAuth.js
- **File Storage**: Cloudflare R2 or AWS S3

### Integrations
- **Instagram**: Graph API (Business Account required)
- **Image Processing**: Sharp (resize, optimize)

### Deployment
- **Hosting**: Vercel
- **Database**: Neon or Supabase

---

## 8. Future Enhancements

1. **AI-Assisted Writing**: GPT integration for caption suggestions
2. **Multi-platform**: Twitter/X, Facebook support
3. **Analytics Dashboard**: Post performance tracking
4. **Scheduling**: Calendar view with scheduled posts
5. **Collaboration**: Multi-user editing, approval workflow
6. **Image Editor**: Built-in flyer/image creation
7. **Templates Library**: Community-shared templates
