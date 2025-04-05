# Pokémon Pokédex

モダンな React と TypeScript で構築されたポケモン図鑑アプリケーション。
学習目的で開発したもので商用目的ではありません。

## 技術スタック

- ⚛️ React 19
- 🛣️ React Router v7.4 (サーバーサイドレンダリング)
- 🎨 Tailwind CSS v4.0.0
- 🔄 tRPC v11.0.0
- 📊 React Query
- 🔒 TypeScript
- 🧩 shadcn/ui コンポーネント

## 機能

- 🔍 ポケモン検索機能
- 📱 レスポンシブデザイン
- 📊 ポケモンの詳細情報表示
  - 基本情報（タイプ、高さ、重さなど）
  - 能力値
  - 特性
  - 進化チェーン
- 🇯🇵 日本語対応

## 開発環境のセットアップ

### 必要条件

- Node.js 18 以上
- npm または bun

### インストール

依存関係をインストールします：

```bash
# npmを使用する場合
npm install

# bunを使用する場合
bun install
```

### 開発サーバーの起動

ホットリロード付きの開発サーバーを起動します：

```bash
npm run dev
# または
bun run dev
```

アプリケーションは `http://localhost:5173` で利用可能になります。

## 本番用ビルド

本番用ビルドを作成します：

```bash
npm run build
# または
bun run build
```

## 本番環境での実行

ビルドしたアプリケーションを実行します：

```bash
npm run start
# または
bun run start
```

## Docker での実行

Docker を使用してアプリケーションをビルドして実行することもできます：

```bash
# イメージのビルド
docker build -t pokemon-pokedex .

# コンテナの実行
docker run -p 3000:3000 pokemon-pokedex
```

## プロジェクト構造

```
pokemon-pokedex/
├── app/                  # アプリケーションのメインコード
│   ├── api/              # APIとデータフェッチング
│   ├── components/       # 再利用可能なUIコンポーネント
│   ├── lib/              # ユーティリティ関数
│   ├── pokemon/          # ポケモン関連のページ
│   ├── server/           # サーバーサイドコード（tRPC）
│   ├── layout.tsx        # メインレイアウト
│   ├── page.tsx          # ホームページ
│   └── routes.ts         # ルート定義
├── public/               # 静的ファイル
├── tailwind.config.js    # Tailwind CSS設定
└── react-router.config.ts # React Router設定
```

---
