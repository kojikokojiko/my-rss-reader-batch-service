import Parser from 'rss-parser';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// .env ファイルの新しいパスを指定
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const parser = new Parser();
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;
// Supabaseクライアントの初期化
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function fetchAndSaveRSS() {
  const feed = await parser.parseURL('https://remoter.hatenablog.com/rss');
  for (const item of feed.items) {
    const { title, link, pubDate, contentSnippet } = item;
    // Supabaseにデータを挿入
    const { error } = await supabase.from('rss_feeds').insert([
      { title, link, pubDate, description: contentSnippet },
    ]);
    
    if (error) {
      console.error('Error inserting data:', error.message);
    } else {
      console.log('Data inserted successfully');
    }
  }
}

fetchAndSaveRSS();
